// Pulama Farm Deployment Installer for Ubuntu
// Rust version - migrated from install.py

use std::env;
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use colored::*;

// ============================================================================
// CONFIGURATION
// ============================================================================

/// Source code root directory on Ubuntu (REQUIRED - set this in production)
pub const SOURCE_CODE: &str = "/home/admini/dev/pulamafarm";

/// Directories for compiled artifacts (relative to source_code)
pub struct Directories {
    pub api_target: PathBuf,
    pub web_target: PathBuf,
    pub db_source: PathBuf,
    pub db_target: PathBuf,
}

impl Directories {
    fn new(source: &str) -> Self {
        Self {
            api_target: PathBuf::from(source).join("var/api"),
            web_target: PathBuf::from(source).join("var/web"),
            db_source: PathBuf::from(source).join("db"),
            db_target: PathBuf::from(source).join("var/database"),
        }
    }

    fn get_venv(&self, source: &str) -> PathBuf {
        PathBuf::from(source).join(".venv")
    }
}

/// Service ports
pub const API_PORT: u16 = 5000;
pub const NGINX_PORT: u16 = 80;

/// Log files directory
const LOGS_DIR: &str = "var/logs";
const INSTALLER_LOG_FILE: &str = "installer.log";

// ============================================================================
// LOGGING
// ============================================================================

struct Logger {
    log_file: Option<PathBuf>,
    exit_code: AtomicBool,
}

impl Logger {
    fn new() -> Self {
        let log_path = PathBuf::from(SOURCE_CODE)
            .join(LOGS_DIR)
            .join(INSTALLER_LOG_FILE);

        // Create logs directory if it doesn't exist
        if let Some(dir) = log_path.parent() {
            fs::create_dir_all(dir).ok();
        }

        Self {
            log_file: Some(log_path.clone()),
            exit_code: AtomicBool::new(false),
        }
    }

    fn format_timestamp(&self) -> String {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap();
        let ms = now.as_millis();
        format!("[{:016}] ", ms)
    }

    fn log(&self, level: Level, msg: &str) {
        let timestamp = self.format_timestamp();
        
        // Console output with colors
        let color = match level {
            Level::Info => "white",
            Level::Success => "green",
            Level::Warning => "yellow",
            Level::Error => "red",
            Level::Debug => "blue",
        };

        println!(format!("{}{}{}", "[{}] {} {}", timestamp, msg, color));

        // File logging
        if let Some(ref log_file) = self.log_file {
            if let Ok(mut file) = File::open(log_file) {
                if let Ok(mut writer) = fs::OpenOptions::new()
                    .create(true)
                    .append(true)
                    .open(log_file) {
                    let _ = writer.write_all((format!("{} {}\n", timestamp, msg)).as_bytes());
                }
            }
        }

        // Update exit code for failed operations
        if matches!(level, Level::Error) {
            self.exit_code.store(true, Ordering::SeqCst);
        }
    }

    fn info(&self, msg: &str) {
        self.log(Level::Info, msg);
    }

    fn success(&self, msg: &str) {
        self.log(Level::Success, msg);
    }

    fn warning(&self, msg: &str) {
        self.log(Level::Warning, msg);
    }

    fn error(&self, msg: &str) {
        self.log(Level::Error, msg);
    }

    fn debug(&self, msg: &str) {
        self.log(Level::Debug, msg);
    }

    /// Check if any errors occurred
    fn has_errors(&self) -> bool {
        self.exit_code.load(Ordering::SeqCst)
    }
}

#[derive(Clone, Copy, Debug)]
enum Level {
    Info,
    Success,
    Warning,
    Error,
    Debug,
}

// ============================================================================
// MAIN INSTALLER STRUCT
// ============================================================================

pub struct Installer<'a> {
    source: &'a str,
    dirs: Directories,
    logger: Logger,
    venv_dir: Option<PathBuf>,
}

impl<'a> Installer<'a> {
    pub fn new(source: &'a str) -> Self {
        let dirs = Directories::new(source);
        let logger = Logger::new();
        
        // Validate source directory
        if !Path::new(source).exists() {
            eprintln!("[{}] Source code directory does not exist: {}", 
                colored!("WARN"), source);
            eprintln!("{}", "Please ensure the SOURCE_CODE constant is set correctly.");
            // Create a dummy logger that writes to file even without console access
        }

        Self {
            source,
            dirs,
            logger,
            venv_dir: None,
        }
    }

    /// Get logger reference
    pub fn logger(&self) -> &Logger {
        &self.logger
    }

    /// Check if installation succeeded
    pub fn success(&self) -> bool {
        !self.logger.has_errors()
    }

    // ========================================================================
    // STEP 1: System Packages
    // ========================================================================
    
    pub fn install_system_packages(&mut self) -> Result<(), String> {
        self.logger.info("=== Installing system packages ===");
        
        let packages = ["python3-pip", "python3-venv", "nginx", "nodejs", "npm"];
        
        // Update package list
        self.logger.info("Updating package list...");
        if let Err(e) = Command::new("apt-get").args(&["update"]).output() {
            return Err(format!("Failed to update package list: {}", e));
        }
        
        // Install packages
        self.logger.info(&format!("Installing packages: {}", packages.join(", ")));
        match Command::new("apt-get")
            .args(&["install", "-y"])
            .args(&packages)
            .output()
        {
            Ok(output) => {
                if output.status.success() {
                    self.logger.success("System packages installed successfully");
                    Ok(())
                } else {
                    Err(String::from_utf8_lossy(&output.stderr).to_string())
                }
            },
            Err(e) => Err(format!("Failed to install packages: {}", e)),
        }
    }

    // ========================================================================
    // STEP 2: Virtual Environment
    // ========================================================================
    
    pub fn create_venv(&mut self) -> Result<PathBuf, String> {
        self.logger.info("=== Creating Python virtual environment ===");
        
        let venv_path = self.dirs.get_venv(self.source);
        
        if !venv_path.exists() {
            self.logger.info("Creating virtual environment...");
            
            match Command::new("python3")
                .args(&["-m", "venv"])
                .arg(&venv_path)
                .output()
            {
                Ok(output) => {
                    if output.status.success() {
                        self.logger.success("Virtual environment created successfully");
                    } else {
                        return Err(String::from_utf8_lossy(&output.stderr).to_string());
                    }
                },
                Err(e) => Err(format!("Failed to create venv: {}", e)),
            }
        } else {
            self.logger.info("Virtual environment already exists");
        }
        
        self.venv_dir = Some(venv_path.clone());
        Ok(venv_path)
    }

    // ========================================================================
    // STEP 3: API Dependencies
    // ========================================================================
    
    pub fn install_api_dependencies(&self) -> Result<(), String> {
        self.logger.info("=== Installing API dependencies ===");
        
        let requirements_path = PathBuf::from(self.source).join("api/requirements.txt");
        
        if !requirements_path.exists() {
            return Err(format!("Requirements file not found at {:?}", requirements_path));
        }
        
        let venv_dir = self.venv_dir.as_ref().unwrap();
        let pip_path = venv_dir.join("bin/pip");
        
        match Command::new(&pip_path)
            .args(&["install", "-r"])
            .arg("requirements.txt")
            .current_dir(self.source)
            .output()
        {
            Ok(output) => {
                if output.status.success() {
                    self.logger.success("API dependencies installed successfully");
                    Ok(())
                } else {
                    Err(String::from_utf8_lossy(&output.stderr).to_string())
                }
            },
            Err(e) => Err(format!("Failed to install API dependencies: {}", e)),
        }
    }

    // ========================================================================
    // STEP 4: Database Handling
    // ========================================================================
    
    pub fn copy_database(&self) -> Result<(), String> {
        self.logger.info("=== Copying database ===");
        
        let db_target = self.dirs.db_target.clone();
        fs::create_dir_all(&db_target).ok();
        
        let db_source_path = self.dirs.db_source.join("order.db");
        
        if !db_source_path.exists() {
            self.logger.warning(&format!("Database file not found at {:?}", db_source_path));
            
            // Try to initialize database with schema
            let api_dir = PathBuf::from(self.source).join("api");
            let db_init_path = api_dir.join("init_db.py");
            
            if db_init_path.exists() {
                self.logger.info("Initializing empty database with schema...");
                
                match Command::new("python3").arg(&db_init_path).output() {
                    Ok(output) => {
                        if output.status.success() {
                            self.logger.success("Database initialization completed");
                        } else {
                            let stderr = String::from_utf8_lossy(&output.stderr);
                            return Err(format!("Failed to initialize database:\n{}", stderr));
                        }
                    },
                    Err(e) => {
                        self.logger.warning(&format!("Could not run init_db.py: {}", e));
                    }
                }
            } else {
                self.logger.info("No database initialization script found");
            }
        }
        
        // Copy database to target location
        let db_target_path = db_target.join("order.db");
        
        if let Err(e) = fs::copy(&db_source_path, &db_target_path) {
            return Err(format!("Failed to copy database: {}", e));
        }
        
        self.logger.success("Database copied to target location");
        Ok(())
    }

    // ========================================================================
    // STEP 5: API Service Configuration
    // ========================================================================
    
    pub fn create_api_service(&self) -> Result<(), String> {
        self.logger.info("=== Creating API systemd service ===");
        
        let api_logs_dir = PathBuf::from(self.source).join("var/logs/api");
        fs::create_dir_all(&api_logs_dir).ok();
        
        let service_file_path = PathBuf::from(self.source).join(".pulamafarm-api.service");
        
        let source_base = PathBuf::from(self.source);
        let venv_bin = source_base.join(".venv/bin/python3");
        
        let service_content = format!(r#"
[Unit]
Description=Pulama Farm API Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory={source}/api
Environment="PATH={venv_bin}:/usr/local/bin:/usr/bin:/bin"
ExecStart={venv_bin} {source}/api/app.py
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
"#, source = self.source, venv_bin = venv_bin.display());
        
        let mut file = match File::create(&service_file_path) {
            Ok(f) => f,
            Err(e) => return Err(format!("Failed to create service file: {}", e)),
        };
        
        if let Err(e) = file.write_all(service_content.as_bytes()) {
            return Err(format!("Failed to write service file: {}", e));
        }
        
        self.logger.success(&format!("API service file created at {:?}", service_file_path));
        Ok(())
    }

    pub fn compile_api(&self) -> Result<(), String> {
        self.logger.info("=== Compiling API ===");
        
        let api_target_dir = self.dirs.api_target.clone();
        fs::create_dir_all(&api_target_dir).ok();
        
        // Copy API files to target (except venv)
        let api_source_dir = PathBuf::from(self.source).join("api");
        let db_source = PathBuf::from(self.source).join("db");
        
        // Copy .py, .txt, .conf files from api directory
        for root in &["app.py", "init_db.py"] {
            let src_file = api_source_dir.join(root);
            if src_file.exists() {
                let rel_path = root;
                let dst_path = api_target_dir.join(rel_path);
                fs::create_dir_all(dst_path.parent().unwrap()).ok();
                if let Err(e) = fs::copy(&src_file, &dst_path) {
                    self.logger.warning(&format!("Failed to copy {}: {}", root, e));
                }
            }
        }
        
        // Copy requirements.txt
        let req_file = api_source_dir.join("requirements.txt");
        if req_file.exists() {
            let dst_path = api_target_dir.join("requirements.txt");
            fs::create_dir_all(dst_path.parent().unwrap()).ok();
            if let Err(e) = fs::copy(&req_file, &dst_path) {
                self.logger.warning(&format!("Failed to copy requirements.txt: {}", e));
            }
        }
        
        // Copy database files
        if db_source.exists() {
            for entry in fs::read_dir(&db_source).ok() {
                let src_file = entry.ok().unwrap_or_default();
                let src_path = db_source.join(src_file.file_name());
                
                if src_path.is_file() {
                    let rel_path = src_file.file_name();
                    let dst_path = api_target_dir.join(rel_path);
                    fs::create_dir_all(dst_path.parent().unwrap()).ok();
                    if let Err(e) = fs::copy(&src_path, &dst_path) {
                        self.logger.warning(&format!("Failed to copy db file: {}", e));
                    }
                }
            }
        }
        
        self.logger.success("API files copied to target directory");
        Ok(())
    }

    pub fn start_api_service(&self) -> Result<(), String> {
        self.logger.info("=== Starting API service ===");
        
        let source_base = PathBuf::from(self.source).parent().unwrap_or(Path::new("/"));
        let service_file_path = source_base.join(".pulamafarm-api.service");
        
        match Command::new("systemctl").args(&["daemon-reload"]).output() {
            Ok(output) if output.status.success() => {},
            Err(e) | Ok(_output) if !output.as_ref().map(|o| o.status.success()).unwrap_or(false) => {
                return Err(String::from_utf8_lossy(Command::new("systemctl").args(&["daemon-reload"]).output().unwrap().stderr.as_bytes()).to_string());
            }
        }
        
        self.logger.info("Copying and enabling API service...");
        
        if let Err(e) = Command::new("cp")
            .arg(&service_file_path)
            .arg("/etc/systemd/system/pulamafarm-api.service")
            .output()
        {
            return Err(format!("Failed to copy service file: {}", e));
        }
        
        match Command::new("systemctl").args(&["enable", "pulamafarm-api"]).output() {
            Ok(output) if output.status.success() => {},
            _ => return Err(String::from_utf8_lossy(Command::new("systemctl")
                .args(&["enable", "pulamafarm-api"])
                .output()
                .unwrap_or_default()
                .stderr.as_bytes())
                .to_string()),
        }
        
        match Command::new("systemctl").args(&["start", "pulamafarm-api"]).output() {
            Ok(output) if output.status.success() => {
                self.logger.success("API service started successfully");
                Ok(())
            },
            _ => Err(String::from_utf8_lossy(Command::new("systemctl").args(&["start", "pulamafarm-api"])
                .output()
                .unwrap_or_default()
                .stderr.as_bytes())
                .to_string()),
        }
    }

    // ========================================================================
    // STEP 6: Angular Web Compilation
    // ========================================================================
    
    pub fn compile_angular(&self) -> Result<(), String> {
        self.logger.info("=== Compiling Angular application ===");
        
        let web_dir = PathBuf::from(self.source).join("web/pulama-farm");
        let src_dir = web_dir.join("src");
        
        if !src_dir.exists() {
            return Err(format!("Source directory not found: {:?}", src_dir));
        }
        
        match Command::new("npm").args(&["run", "build"]).current_dir(web_dir).output() {
            Ok(output) => {
                if output.status.success() {
                    self.logger.success("Angular build completed successfully");
                    
                    // Find the output directory (dist/ or build/)
                    let dist_path = web_dir.join("dist");
                    let build_path = web_dir.join("build");
                    
                    let output_dir = if dist_path.exists() { &dist_path } else { &build_path };
                    
                    if !output_dir.exists() {
                        self.logger.warning("No dist/ or build/ directory found");
                    }
                    
                    Ok(())
                } else {
                    Err(String::from_utf8_lossy(&output.stderr).to_string())
                }
            },
            Err(e) => Err(format!("Failed to compile Angular: {}", e)),
        }
    }

    // ========================================================================
    // STEP 7: Copy Web Files
    // ========================================================================
    
    pub fn copy_web_to_target(&self) -> Result<(), String> {
        self.logger.info("=== Copying compiled web files ===");
        
        let web_source_dir = self.dirs.web_target.clone();
        
        if !web_source_dir.exists() {
            return Err(format!("Compiled web files not found at {:?}", web_source_dir));
        }
        
        for entry in fs::read_dir(&web_source_dir).map_err(|e| format!("Failed to read directory: {}", e))? {
            let src_path = web_source_dir.join(entry.file_name());
            
            match fs::copy(&src_path, &self.dirs.web_target.join(src_path.file_name().unwrap())) {
                Ok(_) => {},
                Err(e) => return Err(format!("Failed to copy file: {}", e)),
            }
        }
        
        self.logger.success("Web files copied to target directory");
        Ok(())
    }

    // ========================================================================
    // STEP 8: Nginx Configuration
    // ========================================================================
    
    pub fn create_web_service_file(&self) -> Result<(), String> {
        self.logger.info("=== Creating Nginx configuration ===");
        
        let web_logs_dir = PathBuf::from(self.source).join("var/logs/web");
        fs::create_dir_all(&web_logs_dir).ok();
        
        let nginx_conf_path = PathBuf::from(self.source).join("nginx.conf.web");
        
        let source_base = PathBuf::from(self.source);
        
        let nginx_content = format!(r#"# Nginx configuration for Pulama Farm Web Application
server {{
    listen 80;
    server_name pulamafarm.duckdns.org localhost;

    # Access and error logs
    access_log /var/log/nginx/pulamafarm-web_access.log;
    error_log /var/log/nginx/pulamafarm-web_error.log;

    location / {{
        proxy_pass http://localhost:{port};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeouts for long processing requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Increase client body size
        client_max_body_size 10M;
    }}
}}
"#, port = API_PORT);
        
        let mut file = match File::create(&nginx_conf_path) {
            Ok(f) => f,
            Err(e) => return Err(format!("Failed to create nginx config: {}", e)),
        };
        
        if let Err(e) = file.write_all(nginx_content.as_bytes()) {
            return Err(format!("Failed to write nginx config: {}", e));
        }
        
        self.logger.success("Nginx configuration file created");
        Ok(())
    }

    pub fn configure_nginx(&self) -> Result<(), String> {
        self.logger.info("=== Configuring Nginx ===");
        
        let nginx_sites_dir = "/etc/nginx/sites-available";
        let nginx_sites_enabled_dir = "/etc/nginx/sites-enabled";
        
        fs::create_dir_all(nginx_sites_enabled_dir).ok();
        
        let web_nginx_path = PathBuf::from(self.source).join("nginx.conf.web");
        
        if !web_nginx_path.exists() {
            return Err(format!("Nginx config file not found: {:?}", web_nginx_path));
        }
        
        // Create symlink to sites-available
        let nginx_conf_file = format!("{}/nginx.conf.web", env::var("HOME").unwrap_or_else(|_| String::from("/root")));
        let nginx_link = format!("{}/pulama-farm.conf", nginx_sites_dir);
        
        if PathBuf::from(&nginx_conf_file).exists() {
            // Read and write to sites-available
            match fs::read_to_string(&nginx_conf_file) {
                Ok(content) => {
                    let mut file = File::create(&nginx_link).map_err(|e| format!("Failed to create symlink: {}", e))?;
                    file.write_all(content.as_bytes()).map_err(|e| format!("Failed to write config: {}", e))?;
                }
                Err(e) => return Err(format!("Failed to read nginx config: {}", e)),
            }
        }
        
        // Enable the site via symlink
        if PathBuf::from(&nginx_link).exists() {
            if let Err(e) = fs::create_symlink(&nginx_link, 
                format!("{}/pulama-farm.conf", nginx_sites_enabled_dir))
            {
                return Err(format!("Failed to enable nginx site: {}", e));
            }
        }
        
        self.logger.success("Nginx configuration enabled");
        
        // Test nginx configuration
        self.logger.info("Testing Nginx configuration...");
        let nginx_test = Command::new("nginx").args(&["-t"]).output();
        
        match nginx_test {
            Ok(output) if output.status.success() => {},
            _ => return Err(String::from_utf8_lossy(&nginx_test.unwrap().stderr).to_string()),
        }
        
        // Restart nginx
        match Command::new("systemctl").args(&["restart", "nginx"]).output() {
            Ok(output) if output.status.success() => {
                self.logger.success("Nginx restarted successfully");
            },
            _ => return Err(String::from_utf8_lossy(Command::new("systemctl")
                .args(&["restart", "nginx"])
                .output()
                .unwrap_or_default()
                .stderr.as_bytes())
                .to_string()),
        }
        
        Ok(())
    }

    // ========================================================================
    // STEP 9: Create Test Scripts
    // ========================================================================
    
    pub fn create_api_test_script(&self) -> Result<(), String> {
        self.logger.info("=== Creating API test script ===");
        
        let scripts_dir = PathBuf::from(self.source).join("var/scripts");
        fs::create_dir_all(&scripts_dir).ok();
        
        let test_script_path = scripts_dir.join("test-api.sh");
        
        let script_content = format!(r#"#!/bin/bash
# Pulama Farm API Test Script

echo "=== Testing Pulama Farm API ==="
echo ""

API_URL="http://localhost:{port}"

# Health Check
echo "Testing ${{API_URL}}/api/health..."
curl -s -o /dev/null -w "Status Code: {{%%{http_code}}}\\n" "${{API_URL}}/api/health" || echo "FAILED to connect to API"

echo ""
echo "=== API Tests Complete ==="
"#, port = API_PORT);
        
        let mut file = File::create(&test_script_path).map_err(|e| format!("Failed to create test script: {}", e))?;
        file.write_all(script_content.as_bytes()).map_err(|e| format!("Failed to write test script: {}", e))?;
        
        fs::set_permissions(&test_script_path, std::os::unix::fs::PermissionsExt::from_mode(0o755))
            .ok();
        
        self.logger.success("API test script created");
        Ok(())
    }

    pub fn create_web_test_script(&self) -> Result<(), String> {
        self.logger.info("=== Creating Web Test Script ===");
        
        let scripts_dir = PathBuf::from(self.source).join("var/scripts");
        
        let test_script_path = scripts_dir.join("test-web.sh");
        
        let script_content = r#"#!/bin/bash
# Pulama Farm Web Test Script

echo "=== Testing Pulama Farm Web Application ==="
echo ""

WEB_URL="http://localhost"

# Homepage Test
echo "Testing $WEB_URL/..."
curl -s -o /dev/null -w "Status Code: %{http_code}\n" "$WEB_URL/" || echo "FAILED to connect to web server"

echo ""
echo "=== Web Tests Complete ==="#;
        
        let mut file = File::create(&test_script_path).map_err(|e| format!("Failed to create test script: {}", e))?;
        file.write_all(script_content.as_bytes()).map_err(|e| format!("Failed to write test script: {}", e))?;
        
        fs::set_permissions(&test_script_path, std::os::unix::fs::PermissionsExt::from_mode(0o755))
            .ok();
        
        self.logger.success("Web test script created");
        Ok(())
    }

    // ========================================================================
    // STEP 10: Run Tests
    // ========================================================================
    
    pub fn test_api(&self) -> (u32, Vec<(String, String)>) {
        self.logger.info("=== Testing API ===");
        
        let mut tests_passed = 0;
        let mut tests_failed: Vec<(String, String)> = Vec::new();
        
        // Health check
        let health_url = format!("http://localhost:{}/api/health", API_PORT);
        
        match Command::new("curl")
            .args(&["-s", "-o", "/dev/null", "-w", "%{http_code}"])
            .arg(&health_url)
            .output()
        {
            Ok(output) if output.status.success() => {
                let http_code = String::from_utf8_lossy(&output.stdout).trim().to_string();
                if http_code == "200" {
                    self.logger.success("Health check passed");
                    tests_passed += 1;
                } else {
                    tests_failed.push((format!("{} (HTTP {})", "/api/health", http_code), 
                                        format!("API health check failed with code {}", http_code)));
                }
            },
            Ok(_) | Err(_) => {
                tests_failed.push(("Health check (connectivity)".to_string(), 
                                  "Cannot connect to API server".to_string()));
            }
        }
        
        (tests_passed, tests_failed)
    }

    pub fn test_web(&self) -> (u32, Vec<(String, String)>) {
        self.logger.info("=== Testing Web Application ===");
        
        let mut tests_passed = 0;
        let mut tests_failed: Vec<(String, String)> = Vec::new();
        
        // Test homepage
        let web_url = "http://localhost/";
        
        match Command::new("curl")
            .args(&["-s", "-o", "/dev/null", "-w", "%{http_code}"])
            .arg(web_url)
            .output()
        {
            Ok(output) if output.status.success() => {
                let http_code = String::from_utf8_lossy(&output.stdout).trim().to_string();
                if http_code == "200" {
                    self.logger.success("Homepage returned HTTP 200");
                    tests_passed += 1;
                } else {
                    tests_failed.push(("Homepage (HTTP)".to_string(), 
                                      format!("Homepage returned HTTP {} instead of 200", http_code)));
                }
            },
            _ => {
                tests_failed.push(("Homepage (connectivity)".to_string(), "Cannot connect to web server".to_string()));
            }
        }
        
        (tests_passed, tests_failed)
    }

    // ========================================================================
    // STEP 11: Generate Test Report
    // ========================================================================
    
    pub fn generate_test_report(&self, 
                                 api_passed: u32, 
                                 api_failed: &Vec<(String, String)>, 
                                 web_passed: u32, 
                                 web_failed: &Vec<(String, String)>) -> Result<(), String> {
        self.logger.info("=== Generating Test Report ===");
        
        let reports_dir = PathBuf::from(self.source).join("var/reports");
        fs::create_dir_all(&reports_dir).ok();
        
        let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S").to_string();
        let report_path = reports_dir.join(format!("test_report_{}.txt", timestamp));
        
        let mut file = File::create(&report_path).map_err(|e| format!("Failed to create report: {}", e))?;
        
        let api_fail_count = api_failed.len() as u32;
        let web_fail_count = web_failed.len() as u32;
        
        let total_passed = api_passed + web_passed;
        let total_failed = api_fail_count + web_fail_count;
        
        let summary = if total_failed == 0 {
            "*** DEPLOYMENT SUCCESSFUL ***"
        } else {
            "*** DEPLOYMENT HAS ISSUES ***\nPlease review the errors above and fix them."
        };
        
        let report_content = format!(r#"============================================================
PULAMA FARM DEPLOYMENT TEST REPORT
Generated: {}
============================================================

API TEST RESULTS
----------------------------------------
"#, chrono::Utc::now().format("%Y-%m-%d %H:%M:%S"));
        
        // Add API results
        if api_fail_count > 0 {
            for (name, error) in api_failed.iter() {
                writeln!(&mut file, "FAILED: {}", name).ok();
                writeln!(&mut file, "Error: {}", error).ok();
                writeln!(&mut file).ok();
            }
        } else {
            writeln!(&mut file, "All API tests passed!").ok();
        }
        
        writeln!(&mut file, "Tests Passed: {}", api_passed).ok();
        writeln!(&mut file, "Tests Failed: {}", api_fail_count).ok();
        
        // Add Web results
        writeln!(file, "\nWEB TEST RESULTS\n----------------------------------------").ok();