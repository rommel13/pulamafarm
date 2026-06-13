#!/bin/bash

# How to run this script on Ubuntu:
# 1. Edit this file to set the correct SOURCE_LOCATION.
# 2. Make the script executable: chmod +x installer/install.sh
# 3. Run the script with sudo (required for apt-get and nginx configuration):
#    sudo ./installer/install.sh
# Note: Ensure you have internet access for dependency installation.

# Configuration
SOURCE_LOCATION="/home/admini/dev/pulamafarm" # Set your source location here
DB_SOURCE="db/order.db"
TARGET_DIR="/var/www/pulamafarm"
WEB_HOST="pulamafarm.duckdns.org"
API_HOST="pulamafarm-api.duckdns.org"

echo "Starting installation for $WEB_HOST and $API_HOST..."

# Ensure target directory exists
sudo mkdir -p $TARGET_DIR
sudo chown -R $USER:$USER $TARGET_DIR

# Copy Database
echo "Copying database..."
cp $DB_SOURCE $TARGET_DIR/order.db

# Install dependencies (Ubuntu)
echo "Installing system dependencies..."
sudo apt-get update
sudo apt-get install -y nginx python3-pip python3-flask nodejs npm

# Copy Source Files
echo "Copying source files from $SOURCE_LOCATION..."
sudo cp -r $SOURCE_LOCATION/web $TARGET_DIR/web
sudo cp -r $SOURCE_LOCATION/api $TARGET_DIR/api

# Setup Web (Angular)
echo "Setting up Angular Web..."
cd $TARGET_DIR/web
npm install
# Note: Build command would go here if needed

# Run API Installer
echo "Running API installer..."
chmod +x ./installer/install-api.sh
./installer/install-api.sh

# Configure Nginx
echo "Configuring Nginx for $WEB_HOST and $API_HOST..."

# Remove existing configuration if it exists
sudo rm -f /etc/nginx/sites-available/pulamafarm
sudo rm -f /etc/nginx/sites-enabled/pulamafarm

cat <<EOF | sudo tee /etc/nginx/sites-available/pulamafarm
server {
    listen 80;
    server_name $WEB_HOST;

    location / {
        root $TARGET_DIR/web;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
}

server {
    listen 80;
    server_name $API_HOST;

    location / {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/pulamafarm /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

echo "Nginx restarted."

# Quick API Test
echo "Performing quick API test..."
sleep 2 # Give Nginx and Flask a moment to initialize
curl -s http://$API_HOST | grep "{" || echo "API test failed or returned no JSON"

echo "Installation complete!"
