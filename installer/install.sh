#!/bin/bash

# How to run this script on Ubuntu:
# 1. Edit this file to set the correct SOURCE_LOCATION.
# 2. Make the script executable: chmod +x installer/install.sh
# 3. Run the script with sudo (required for apt-get and nginx configuration):
#    sudo ./installer/install.sh

# Configuration
SOURCE_LOCATION="/home/admini/dev/pulamafarm" # Set your source location here

echo "Starting full installation..."

# Install Web components
chmod +x installer/install-web.sh
./installer/install-web.sh

# Install API components
chmod +x installer/install-api.sh
./installer/install-api.sh

echo "Full installation complete!"