#!/bin/bash

# How to run this script on Ubuntu:
# 1. Edit this file to set the correct SOURCE_LOCATION.
# 2. Make the script executable: chmod +x installer/install-web.sh
# 3. Run the script with sudo (required for apt-get and nginx configuration):
#    sudo ./installer/install-web.sh

# Configuration
SOURCE_LOCATION="/home/admini/dev/pulamafarm" # Set your source location here
TARGET_DIR="/var/www/pulamafarm"
WEB_HOST="pulamafarm.duckdns.org"

echo "Starting web installation for $WEB_HOST..."

# Ensure target directory exists and is clean
sudo rm -rf $TARGET_DIR/*
sudo mkdir -p $TARGET_DIR

# Install system dependencies (Ubuntu) and Node.js/NPM
echo "Installing system dependencies..."
sudo apt-get update && sudo apt-get install -y nginx

# Copy source code to a temporary build location
echo "Copying source files from $SOURCE_LOCATION..."
sudo cp -r $SOURCE_LOCATION/web/* $TARGET_DIR/

# Build the Angular application (create /dist)
echo "Building Angular Application with npm run build..."
cd $TARGET_DIR
npm install
npm run build

# Copy only the transpiled 'dist' folder to target
echo "Copying built files to final web root..."
sudo cp -r dist/* $TARGET_DIR/

# Configure Nginx for $WEB_HOST
echo "Configuring Nginx for $WEB_HOST..."

# Remove existing configuration if it exists
sudo rm -f /etc/nginx/sites-available/pulamafarm
sudo rm -f /etc/nginx/sites-enabled/pulamafarm

cat <<EOF | sudo tee /etc/nginx/sites-available/pulamafarm
server {
    listen 80;
    server_name $WEB_HOST;

    location / {
        root $TARGET_DIR;
        index index.html;
        try_files \$uri \$uri/ =404;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/pulamafarm /etc/nginx/sites-enabled/
sudo systemctl restart nginx

echo "Nginx restarted."

echo "Web installation for $WEB_HOST complete."
