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
HOST="pulamafarm.duckdns.org"

echo "Starting installation for $HOST..."

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

# Setup API (Flask)
echo "Setting up Flask API..."
cd $TARGET_DIR/api
python3 -m venv venv
./venv/bin/pip install -r requirements.txt

# Setup Web (Angular)
echo "Setting up Angular Web..."
cd $TARGET_DIR/web
npm install
# Note: Build command would go here if needed

# Configure Nginx
echo "Configuring Nginx for $HOST..."
cat <<EOF | sudo tee /etc/nginx/sites-available/pulamafarm
server {
    listen 80;
    server_name $HOST;

    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location / {
        root $TARGET_DIR/web;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/pulamafarm /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

echo "Installation complete!"