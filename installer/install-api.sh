#!/bin/bash

# How to run this script on Ubuntu:
# 1. Edit this file to set the correct SOURCE_LOCATION.
# 2. Make the script executable: chmod +x installer/install-api.sh
# 3. Run the script with sudo (required for apt-get and nginx configuration):
#    sudo ./installer/install-api.sh
# Note: Ensure you have internet access for dependency installation.

# Configuration
SOURCE_LOCATION="/home/admini/dev/pulamafarm" # Set your source location here
DB_SOURCE="db/order.db"
TARGET_DIR="/var/www/pulamafarm"
API_HOST="pulamafarm-api.duckdns.org"

echo "Starting API installation..."

# Ensure target directory exists
sudo mkdir -p $TARGET_DIR
sudo chown -R $USER:$USER $TARGET_DIR

# Copy Database
echo "Copying database..."
cp $DB_SOURCE $TARGET_DIR/order.db

# Install dependencies (Ubuntu)
echo "Installing system dependencies..."
sudo apt-get update
sudo apt-get install -y python3-pip python3-flask

# Setup API (Flask)
echo "Setting up Flask API..."
cd $TARGET_DIR/api
python3 -m venv venv
./venv/bin/pip install -r requirements.txt

# Create Systemd Service
echo "Creating systemd service for API..."
cat <<EOF | sudo tee /etc/systemd/system/pulamafarm-api.service
[Unit]
Description=Pulama Farm Flask API
After=network.target

[Service]
User=$USER
Group=$USER
WorkingDirectory=$TARGET_DIR/api
ExecStart=/var/www/pulamafarm/api/venv/bin/python /var/www/pulamafarm/api/app.py
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start service
sudo systemctl daemon-reload
sudo systemctl enable pulamafarm-api
sudo systemctl restart pulamafarm-api

# Quick API Test
echo "Performing quick API test..."
sleep 3 # Give Nginx and Flask a moment to initialize
curl -s http://$API_HOST | grep "{" || echo "API test failed or returned no JSON"

echo "API installation complete!"
