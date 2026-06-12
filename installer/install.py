#!/usr/bin/env python3
"""
Pulama Farm Deployment Installer for Ubuntu

This script performs:
1. API compilation (Flask) -> var folder, configures systemd service
2. Web compilation (Angular) -> var folder, configures nginx
3. Database handling and copying
4. Service restarts and testing
5. Issue reporting to console and log files
"""

import os
import sys
import subprocess
import shutil
import logging
from datetime import datetime
from typing import List, Optional

# ============================================================================
# CONFIGURATION
# ============================================================================

# Source code root directory on Ubuntu drive (REQUIRED - set this variable)
source_code = "/mnt/ubuntu-drive/root-source-code"  # UPDATE THIS PATH

# Directories for compiled artifacts (relative to source_code)
API_TARGET_DIR = os.path.join(source_code, "var", "api")
WEB_TARGET_DIR = os.path.join(source_code, "var", "web")
DB_SOURCE = os.path.join(source_code, "db")
DB_TARGET = os.path.join(source_code, "var", "database")

# Service ports
API_PORT = 5000
NGINX_PORT = 80

# Log files
INSTALL_LOG = os.path.join(source_code, "var", "logs", "installer.log")


def log_message(msg: str, level: str = "INFO") -> None:
    """Log message to console and file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted_msg = f"[{timestamp}] [{level}] {msg}"
    
    # Console output with colors
    color_map = {
        "INFO": "\033[92m",     # Green
        "SUCCESS": "\033[92m",  # Green
        "WARNING": "\033[93m",   # Yellow
        "ERROR": "\033[91m",     # Red
        "DEBUG": "\033[94m",    # Blue
    }
    
    color = color_map.get(level, "")
    reset = "\033[0m"
    colored_msg = f"{color}{formatted_msg}{reset}"
    print(colored_msg)
    
    # File logging
    os.makedirs(os.path.dirname(INSTALL_LOG), exist_ok=True)
    with open(INSTALL_LOG, "a") as f:
        f.write(formatted_msg + "\n")


def check_apt_packages() -> bool:
    """Install required system packages."""
    log_message("=== Installing system packages ===", "INFO")
    
    packages = [
        "python3-pip",      # Python pip for dependencies
        "python3-venv",     # Python virtualenv
        "nginx",            # Nginx web server
        "nodejs",           # Node.js for Angular compilation
        "npm",              # npm package manager
    ]
    
    try:
        log_message("Updating package list...", "INFO")
        subprocess.run(["apt-get", "update"], check=True)
        
        log_message(f"Installing packages: {', '.join(packages)}", "INFO")
        subprocess.run(["apt-get", "install", "-y"] + packages, check=True)
        
        log_message("System packages installed successfully", "SUCCESS")
        return True
    except subprocess.CalledProcessError as e:
        log_message(f"Failed to install packages: {e}", "ERROR")
        return False


def create_virtual_environment() -> str:
    """Create and activate Python virtual environment."""
    log_message("=== Creating Python virtual environment ===", "INFO")
    
    venv_dir = os.path.join(source_code, ".venv")
    
    if not os.path.exists(venv_dir):
        log_message("Creating virtual environment...", "INFO")
        subprocess.run([
            "python3", "-m", "venv", venv_dir
        ], check=True)
        
        log_message("Virtual environment created successfully", "SUCCESS")
    else:
        log_message("Virtual environment already exists", "INFO")
    
    return venv_dir


def install_api_dependencies(venv_dir: str) -> bool:
    """Install Flask API dependencies."""
    log_message("=== Installing API dependencies ===", "INFO")
    
    requirements_path = os.path.join(source_code, "api", "requirements.txt")
    
    if not os.path.exists(requirements_path):
        log_message(f"Requirements file not found at {requirements_path}", "ERROR")
        return False
    
    pip_path = os.path.join(venv_dir, "bin", "pip")
    
    try:
        log_message("Installing requirements from requirements.txt...", "INFO")
        result = subprocess.run([pip_path, "install", "-r", requirements_path], 
                                capture_output=True, text=True)
        
        if result.returncode != 0:
            log_message(f"Failed to install API dependencies:\n{result.stderr}", "ERROR")
            return False
        
        log_message("API dependencies installed successfully", "SUCCESS")
        return True
    except subprocess.CalledProcessError as e:
        log_message(f"Failed to install API dependencies: {e}", "ERROR")
        return False


def copy_database() -> bool:
    """Copy database to target location."""
    log_message("=== Copying database ===", "INFO")
    
    os.makedirs(DB_TARGET, exist_ok=True)
    
    # Check if source database exists
    db_source_path = os.path.join(source_code, "db", "order.db")
    if not os.path.exists(db_source_path):
        log_message(f"Database file not found at {db_source_path}", "WARNING")
        
        # Initialize empty database with schema
        api_dir = os.path.join(source_code, "api")
        db_init_path = os.path.join(api_dir, "init_db.py")
        
        if os.path.exists(db_init_path):
            log_message("Initializing empty database with schema...", "INFO")
            env = {**os.environ}
            env["PATH"] = os.path.join(source_code, ".venv", "bin") + ":" + env["PATH"]
            
            result = subprocess.run([
                "python3", db_init_path
            ], capture_output=True, text=True, env=env)
            
            if result.returncode != 0:
                log_message(f"Failed to initialize database:\n{result.stderr}", "ERROR")
                return False
        
        log_message("Database initialization completed", "SUCCESS")
    
    # Copy database to target
    shutil.copy2(db_source_path, os.path.join(DB_TARGET, "order.db"))
    
    log_message("Database copied to target location", "SUCCESS")
    return True


def create_api_service() -> bool:
    """Create systemd service file for Flask API."""
    log_message("=== Creating API systemd service ===", "INFO")
    
    # Create logs directory if not exists
    api_logs_dir = os.path.join(source_code, "var", "logs", "api")
    os.makedirs(api_logs_dir, exist_ok=True)
    
    service_file_path = os.path.join(source_code, ".pulamafarm-api.service")
    
    service_content = f'''[Unit]
Description=Pulama Farm API Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory={os.path.join(source_code, "api")}
Environment="PATH={os.path.join(source_code, '.venv', 'bin')}:/usr/local/bin:/usr/bin:/bin"
ExecStart={os.path.join(source_code, '.venv', 'bin', 'python3')} {os.path.join(source_code, 'api', 'app.py')}
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
'''
    
    with open(service_file_path, "w") as f:
        f.write(service_content)
    
    log_message(f"API service file created at {service_file_path}", "SUCCESS")
    return True


def compile_api(venv_dir: str) -> bool:
    """Compile/run API and copy to target directory."""
    log_message("=== Compiling API ===", "INFO")
    
    # For Flask, we run the development server and serve directly
    # The 'compilation' here means ensuring it's ready to serve
    
    env = {**os.environ}
    env["PATH"] = os.path.join(source_code, ".venv", "bin") + ":" + env["PATH"]
    
    # Create target directory
    os.makedirs(API_TARGET_DIR, exist_ok=True)
    
    # Copy API files to target (except venv)
    api_source_dir = os.path.join(source_code, "api")
    db_source = os.path.join(source_code, "db")
    
    items_to_copy = ["*.py", "*.txt", "*.conf", "db/*.db"]
    
    for item in items_to_copy:
        pattern_files = []
        for root, dirs, files in os.walk(api_source_dir):
            for file in files:
                if file.endswith(".py") or file.endswith(".txt") or file.endswith(".conf"):
                    pattern_files.append(os.path.join(root, file))
        
        for src_file in pattern_files:
            rel_path = os.path.relpath(src_file, api_source_dir)
            dst_path = os.path.join(API_TARGET_DIR, rel_path)
            dst_dir = os.path.dirname(dst_path)
            os.makedirs(dst_dir, exist_ok=True)
            shutil.copy2(src_file, dst_path)
        
        # Copy database
        if item == "db/*.db":
            db_files = [os.path.join(db_source, f) for f in os.listdir(db_source) 
                        if os.path.isfile(os.path.join(db_source, f))]
            for src_db in db_files:
                rel_path = os.path.relpath(src_db, db_source)
                dst_path = os.path.join(API_TARGET_DIR, rel_path)
                shutil.copy2(src_db, dst_path)
    
    log_message("API files copied to target directory", "SUCCESS")
    return True


def start_api_service() -> bool:
    """Start the API systemd service."""
    log_message("=== Starting API service ===", "INFO")
    
    source_code_base = os.path.dirname(source_code)
    service_file_path = os.path.join(source_code_base, ".pulamafarm-api.service")
    
    try:
        subprocess.run(["systemctl", "daemon-reload"], check=True)
        
        log_message("Copying and enabling API service...", "INFO")
        subprocess.run([
            "cp", service_file_path, 
            "/etc/systemd/system/pulamafarm-api.service"
        ], check=True)
        
        subprocess.run(["systemctl", "enable", "pulamafarm-api"], check=True)
        
        log_message("Starting API service...", "INFO")
        subprocess.run(["systemctl", "start", "pulamafarm-api"], check=True)
        
        log_message("API service started successfully", "SUCCESS")
        return True
    except subprocess.CalledProcessError as e:
        log_message(f"Failed to start API service: {e}", "ERROR")
        return False


def test_api() -> tuple:
    """Test API endpoints."""
    log_message("=== Testing API ===", "INFO")
    
    tests_passed = 0
    tests_failed = []
    
    try:
        # Health check
        log_message("Testing /api/health endpoint...", "INFO")
        result = subprocess.run([
            "curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
            f"http://localhost:{API_PORT}/api/health"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            log_message("Health check passed", "SUCCESS")
            tests_passed += 1
        else:
            test_name = "/api/health"
            error_msg = f"API health check failed with code {result.stdout.strip()}"
            log_message(error_msg, "ERROR")
            tests_failed.append((test_name, error_msg))
    
    except Exception as e:
        test_name = "/api/health"
        error_msg = f"Health check exception: {str(e)}"
        log_message(error_msg, "ERROR")
        tests_failed.append((test_name, error_msg))
    
    return tests_passed, tests_failed


def create_web_service_file() -> bool:
    """Create nginx service file for web application."""
    log_message("=== Creating Nginx configuration ===", "INFO")
    
    # Create logs directory
    web_logs_dir = os.path.join(source_code, "var", "logs", "web")
    os.makedirs(web_logs_dir, exist_ok=True)
    
    nginx_conf_path = os.path.join(source_code, "nginx.conf.web")
    
    nginx_content = f'''# Nginx configuration for Pulama Farm Web Application
server {
    listen 80;
    server_name localhost;

    # Access and error logs
    access_log /var/log/nginx/pulamafarm-web_access.log;
    error_log /var/log/nginx/pulamafarm-web_error.log;

    location / {
        proxy_pass http://localhost:{API_PORT};
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
    }
}
'''
    
    with open(nginx_conf_path, "w") as f:
        f.write(nginx_content)
    
    log_message("Nginx configuration file created", "SUCCESS")
    return True


def compile_angular() -> bool:
    """Compile Angular application."""
    log_message("=== Compiling Angular application ===", "INFO")
    
    web_dir = os.path.join(source_code, "web", "pulama-farm")
    src_dir = os.path.join(source_code, "web", "pulama-farm", "src")
    
    if not os.path.exists(src_dir):
        log_message(f"Source directory not found: {src_dir}", "ERROR")
        return False
    
    try:
        # Build Angular app in production mode
        log_message("Running 'ng build'...", "INFO")
        
        result = subprocess.run([
            "npm", "run", "build"
        ], cwd=web_dir, capture_output=True, text=True)
        
        if result.returncode != 0:
            log_message(f"Angular build failed:\n{result.stderr}", "ERROR")
            return False
        
        # Find the output directory (default is dist/)
        output_dir = os.path.join(web_dir, "dist")
        if not os.path.exists(output_dir):
            # Try alternative paths
            output_dir = os.path.join(web_dir, "build")
        
        log_message("Angular build completed successfully", "SUCCESS")
        return True
    
    except subprocess.CalledProcessError as e:
        log_message(f"Failed to compile Angular: {e}", "ERROR")
        return False


def copy_web_to_target() -> bool:
    """Copy compiled web files to target directory."""
    log_message("=== Copying compiled web files ===", "INFO")
    
    os.makedirs(WEB_TARGET_DIR, exist_ok=True)
    
    web_source_dir = os.path.join(source_code, "web", "pulama-farm", "dist")
    web_target_dir = WEB_TARGET_DIR
    
    if not os.path.exists(web_source_dir):
        log_message(f"Compiled web files not found at {web_source_dir}", "ERROR")
        return False
    
    # Copy all compiled files (excluding node_modules)
    for item in os.listdir(web_source_dir):
        src_path = os.path.join(web_source_dir, item)
        dst_path = os.path.join(web_target_dir, item)
        
        if os.path.isdir(src_path):
            shutil.copytree(src_path, dst_path)
        else:
            shutil.copy2(src_path, dst_path)
    
    log_message("Web files copied to target directory", "SUCCESS")
    return True


def configure_nginx() -> bool:
    """Configure and restart Nginx server."""
    log_message("=== Configuring Nginx ===", "INFO")
    
    # Create nginx sites-enabled directory if it doesn't exist
    nginx_sites_dir = "/etc/nginx/sites-available"
    nginx_sites_enabled_dir = "/etc/nginx/sites-enabled"
    
    os.makedirs(nginx_sites_enabled_dir, exist_ok=True)
    
    # Read the nginx config from source
    web_nginx_path = os.path.join(source_code, "nginx.conf.web")
    
    if not os.path.exists(web_nginx_path):
        log_message(f"Nginx config file not found: {web_nginx_path}", "ERROR")
        return False
    
    # Create symlink to sites-enabled
    nginx_conf_file = f"{source_code_base}/nginx.conf.web"
    nginx_link = f"{nginx_sites_dir}/pulama-farm.conf"
    
    if os.path.exists(nginx_conf_file):
        with open(nginx_conf_file, "r") as f:
            content = f.read()
        
        # Write to sites-available
        with open(nginx_link, "w") as f:
            f.write(content)
        
        # Enable the site
        if os.path.exists(nginx_link):
            os.symlink(nginx_link, nginx_sites_enabled_dir.replace("sites-available", "sites-enabled"))
    
    log_message("Nginx configuration enabled", "SUCCESS")
    
    # Test nginx configuration
    log_message("Testing Nginx configuration...", "INFO")
    try:
        result = subprocess.run(["nginx", "-t"], capture_output=True, text=True)
        if result.returncode != 0:
            log_message(f"Nginx config test failed:\n{result.stderr}", "ERROR")
            return False
    except Exception as e:
        log_message(f"Failed to test Nginx: {e}", "ERROR")
        return False
    
    # Restart nginx
    try:
        subprocess.run(["systemctl", "restart", "nginx"], check=True)
        log_message("Nginx restarted successfully", "SUCCESS")
    except subprocess.CalledProcessError as e:
        log_message(f"Failed to restart Nginx: {e}", "ERROR")
        return False
    
    return True


def test_web() -> tuple:
    """Test web application."""
    log_message("=== Testing Web Application ===", "INFO")
    
    tests_passed = 0
    tests_failed = []
    
    try:
        # Test homepage
        log_message("Testing http://localhost/...", "INFO")
        result = subprocess.run([
            "curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
            "http://localhost/"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            http_code = result.stdout.strip()
            if http_code == "200":
                log_message("Homepage returned HTTP 200", "SUCCESS")
                tests_passed += 1
            else:
                test_name = "Homepage (HTTP)"
                error_msg = f"Homepage returned HTTP {http_code} instead of 200"
                log_message(error_msg, "ERROR")
                tests_failed.append((test_name, error_msg))
        else:
            test_name = "Homepage (connectivity)"
            error_msg = "Cannot connect to web server"
            log_message(error_msg, "ERROR")
            tests_failed.append((test_name, error_msg))
    
    except Exception as e:
        test_name = "Homepage (connectivity)"
        error_msg = f"Connectivity check exception: {str(e)}"
        log_message(error_msg, "ERROR")
        tests_failed.append((test_name, error_msg))
    
    return tests_passed, tests_failed


def create_api_test_script() -> bool:
    """Create API test script."""
    log_message("=== Creating API test script ===", "INFO")
    
    test_script_path = os.path.join(source_code, "var", "scripts", "test-api.sh")
    os.makedirs(os.path.dirname(test_script_path), exist_ok=True)
    
    script_content = f'''#!/bin/bash
# Pulama Farm API Test Script

echo "=== Testing Pulama Farm API ==="
echo ""

API_URL="http://localhost:{API_PORT}"

# Health Check
echo "Testing ${API_URL}/api/health..."
curl -s -o /dev/null -w "Status Code: %{http_code}\\n" "{API_URL}/api/health" || echo "FAILED to connect to API"

echo ""
echo "=== API Tests Complete ==="
'''
    
    with open(test_script_path, "w") as f:
        # Use triple quotes and escape inner braces for bash variables
        script_content = '''#!/bin/bash
# Pulama Farm API Test Script

echo "=== Testing Pulama Farm API ==="
echo ""

API_URL="http://localhost:{API_PORT}"

# Health Check
echo "Testing $API_URL/api/health..."
curl -s -o /dev/null -w "Status Code: %{http_code}\\n" "$API_URL/api/health" || echo "FAILED to connect to API"

echo ""
echo "=== API Tests Complete ==="
'''
    
    with open(test_script_path, "w") as f:
        f.write(script_content)
    os.chmod(test_script_path, 0o755)
    
    log_message("API test script created", "SUCCESS")
    return True


def create_web_test_script() -> bool:
    """Create web test script."""
    log_message("=== Creating Web Test Script ===", "INFO")
    
    test_script_path = os.path.join(source_code, "var", "scripts", "test-web.sh")
    os.makedirs(os.path.dirname(test_script_path), exist_ok=True)
    
    script_content = '''#!/bin/bash
# Pulama Farm Web Test Script

echo "=== Testing Pulama Farm Web Application ==="
echo ""

WEB_URL="http://localhost"

# Homepage Test
echo "Testing $WEB_URL/..."
curl -s -o /dev/null -w "Status Code: %{http_code}\\n" "$WEB_URL/" || echo "FAILED to connect to web server"

echo ""
echo "=== Web Tests Complete ==="
'''
    
    with open(test_script_path, "w") as f:
        f.write(script_content)
    os.chmod(test_script_path, 0o755)
    
    log_message("Web test script created", "SUCCESS")
    return True



def generate_test_report(api_passed: int, api_failed: list, web_passed: int, web_failed: list) -> bool:
    """Generate and write test report."""
    log_message("=== Generating Test Report ===", "INFO")
    
    report_dir = os.path.join(source_code, "var", "reports")
    os.makedirs(report_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = os.path.join(report_dir, f"test_report_{timestamp}.txt")
    
    with open(report_path, "w") as f:
        f.write("=" * 60 + "\n")
        f.write("PULAMA FARM DEPLOYMENT TEST REPORT\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 60 + "\n\n")
        
        # API Test Results
        f.write("API TEST RESULTS\n")
        f.write("-" * 40 + "\n")
        if api_failed:
            for name, error in api_failed:
                f.write(f"FAILED: {name}\n")
                f.write(f"Error: {error}\n\n")
        else:
            f.write("All API tests passed!\n\n")
        f.write(f"Tests Passed: {api_passed}\n")
        f.write(f"Tests Failed: {len(api_failed)}\n\n")
        
        # Web Test Results
        f.write("WEB TEST RESULTS\n")
        f.write("-" * 40 + "\n")
        if web_failed:
            for name, error in web_failed:
                f.write(f"FAILED: {name}\n")
                f.write(f"Error: {error}\n\n")
        else:
            f.write("All Web tests passed!\n\n")
        f.write(f"Tests Passed: {web_passed}\n")
        f.write(f"Tests Failed: {len(web_failed)}\n\n")
        
        # Summary
        total_passed = api_passed + web_passed
        total_failed = len(api_failed) + len(web_failed)
        
        f.write("=" * 60 + "\n")
        f.write("SUMMARY\n")
        f.write("-" * 40 + "\n")
        f.write(f"Total Tests Passed: {total_passed}\n")
        f.write(f"Total Tests Failed: {total_failed}\n")
        
        if total_failed == 0:
            f.write("\n*** DEPLOYMENT SUCCESSFUL ***\n")
        else:
            f.write("\n*** DEPLOYMENT HAS ISSUES ***\n")
            f.write("Please review the errors above and fix them.\n\n")
        
        f.write("=" * 60 + "\n")
    
    log_message(f"Test report written to {report_path}", "SUCCESS")
    return True


def main():
    """Main installation function."""
    print("\n" + "=" * 70)
    print("PULAMA FARM DEPLOYMENT INSTALLER")
    print("=" * 70)
    
    log_message("Starting Pulama Farm deployment", "INFO")
    log_message(f"Source Code Directory: {source_code}", "INFO")
    
    # Validate source code directory
    if not os.path.exists(source_code):
        log_message(f"Source code directory does not exist: {source_code}", "ERROR")
        log_message("Please set the 'source_code' variable correctly in this script.", "ERROR")
        return False
    
    log_message(f"Source code directory exists: {source_code}", "SUCCESS")
    
    # Step 1: Install system packages
    if not check_apt_packages():
        log_message("Cannot proceed without required packages", "ERROR")
        return False
    
    # Step 2: Create virtual environment
    venv_dir = create_virtual_environment()
    
    # Step 3: Install API dependencies
    if not install_api_dependencies(venv_dir):
        log_message("Cannot proceed without API dependencies", "ERROR")
        return False
    
    # Step 4: Copy database to target
    if not copy_database():
        log_message("Warning: Database copy failed, continuing...", "WARNING")
    
    # Step 5: Create and start API service
    create_api_service()
    compile_api(venv_dir)
    start_api_service()
    
    # Step 6: Compile Angular web application
    if not compile_angular():
        log_message("Cannot proceed without compiled web application", "ERROR")
        return False
    
    # Step 7: Copy compiled web files to target
    if not copy_web_to_target():
        log_message("Cannot proceed without web files in target", "ERROR")
        return False
    
    # Step 8: Configure and restart Nginx
    create_web_service_file()
    configure_nginx()
    
    # Step 9: Create test scripts
    create_api_test_script()
    create_web_test_script()
    
    # Step 10: Run tests
    api_passed, api_failed = test_api()
    web_passed, web_failed = test_web()
    
    # Step 11: Generate test report
    generate_test_report(api_passed, api_failed, web_passed, web_failed)
    
    # Summary
    log_message("\n" + "=" * 60, "INFO")
    log_message("INSTALLATION COMPLETE", "INFO")
    log_message("=" * 60, "INFO")
    log_message(f"API Status: {api_passed} passed, {len(api_failed)} failed", "INFO")
    log_message(f"Web Status: {web_passed} passed, {len(web_failed)} failed", "INFO")
    
    if not api_failed and not web_failed:
        log_message("All tests passed! Deployment successful.", "SUCCESS")
        return True
    else:
        log_message("Some tests failed. Please review the logs for details.", "ERROR")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)