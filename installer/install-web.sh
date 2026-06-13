# Configuration
SOURCE_LOCATION="/home/romeq/dev/konamamaki/web/pulama-farm/dist/browser" # Set your source location here
TARGET_DIR="/var/www/pulamafarm"
WEB_HOST="pulamafarm.duckdns.org"

echo "Starting web installation for $WEB_HOST..."

# Ensure target directory exists and is clean
sudo rm -rf $TARGET_DIR/*
sudo mkdir -p $TARGET_DIR

# Install system dependencies (Ubuntu) and Nginx
echo "Installing system dependencies..."
sudo apt-get update && sudo apt-get install -y nginx

# Copy the built distribution from web directory to target
# The web directory contains the production build files
echo "Copying built files from $SOURCE_LOCATION to $TARGET_DIR..."
sudo cp -r $SOURCE_LOCATION/* $TARGET_DIR/

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
