# Ubuntu Installation Guide: Pulama Farm (Web + API with Nginx)

This guide provides step-by-step instructions for deploying the Pulama Farm application on an Ubuntu server using Nginx as a reverse proxy.

## Prerequisites

Before starting, ensure you have:

1. **Ubuntu Server** 20.04 or newer
2. **Root/sudo access** to the server
3. **Domain name** pointing to your server IP (optional but recommended)
4. **Ports open**: 80 (HTTP), 443 (HTTPS), and optionally 5000 for API testing

---

## Step 1: Install System Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Python 3, pip, and virtual environment support
sudo apt install -y python3 python3-pip python3-venv

# Install Node.js (version 18 or higher recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Verify installations
python3 --version
node --version
npm --version
nginx -v
```

---

## Step 2: Set Up the API (Flask Backend)

```bash
# Create directory for the application
mkdir -p /var/www/pulamafarm/api
cd /var/www/pulamafarm/api

# Copy API files from your development environment
cp -r ~/konamamaki/api/* .

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Flask dependencies
pip install flask flask-cors pymysql

# Copy database file (if using SQLite) or configure MySQL connection
mkdir -p db
cp ~/konamamaki/db/order.db ./db/ 2>/dev/null || true

# Create systemd service for the API
sudo nano /etc/systemd/system/pulamafarm-api.service
```

**Create `/etc/systemd/system/pulamafarm-api.service` with this content:**

```ini
[Unit]
Description=Pulama Farm Flask API
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/pulamafarm/api
ExecStart=/var/www/pulamafarm/api/venv/bin/python api/app.py
Restart=always
Environment=PYTHONUNBUFFERED=True

[Install]
WantedBy=multi-user.target
```

**Enable and start the API service:**

```bash
# Set proper ownership
sudo chown -R www-data:www-data /var/www/pulamafarm/api/

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable pulamafarm-api.service
sudo systemctl start pulamafarm-api.service

# Check status
sudo systemctl status pulamafarm-api.service
```

---

## Step 3: Set Up the Web Frontend (Angular)

```bash
# Create directory for the web application
mkdir -p /var/www/pulamafarm/web
cd /var/www/pulamafarm/web

# Copy Angular project files from your development environment
cp -r ~/konamamaki/web/* .

# Build the Angular application for production
npm install
npm run build --prod 2>/dev/null || npm run build

# Move built files to Nginx web root
sudo mkdir -p /var/www/pulamafarm/frontend
sudo cp -r dist/pulama-farm/* /var/www/pulamafarm/frontend/
```

---

## Step 4: Configure Nginx

Create the Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/pulamafarm.conf
```

**Add this content to the Nginx config:**

```nginx
# Upstream for Flask API
upstream api {
    server 127.0.0.1:5000;
}

# Server block for the application
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain
    
    root /var/www/pulamafarm/frontend;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css application/xml text/xml;

    # Serve static files (Angular frontend)
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        expires max;
        add_header Cache-Control "public, immutable";
    }

    # API Proxy - Forward requests to Flask backend
    location /api {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Allow larger file uploads (for images)
        client_max_body_size 10M;
    }

    # Health check endpoint
    location /health {
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

**Enable the site:**

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/pulamafarm.conf /etc/nginx/sites-enabled/

# Remove default site if it exists
sudo rm /etc/nginx/sites-enabled/default 2>/dev/null

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Step 5: Configure Firewall (UFW)

If you have UFW enabled:

```bash
sudo ufw allow 'Nginx Full'
sudo ufw status
```

---

## Step 6: SSL/TLS Configuration (Optional but Recommended)

**Option A: Using Let's Encrypt (Certbot)**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
```

**Option B: Manual SSL Configuration**

If you have your own certificates, update the Nginx config:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # ... rest of configuration ...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}
```

---

## Step 7: Verify Installation

```bash
# Check API service status
sudo systemctl status pulamafarm-api.service

# Check Nginx status
sudo systemctl status nginx

# Test API endpoint directly (bypassing Nginx)
curl http://127.0.0.1:5000/api/products

# Test through Nginx
curl http://your-domain.com/api/products

# View logs if issues occur
sudo journalctl -u pulamafarm-api.service -f
sudo tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

**API not responding:**
```bash
# Check if port 5000 is listening
sudo netstat -tlnp | grep 5000

# Restart API service
sudo systemctl restart pulamafarm-api.service

# View logs
sudo journalctl -u pulamafarm-api.service --since "1 hour ago"
```

**Nginx returns 502 Bad Gateway:**
- Ensure the Flask API is running