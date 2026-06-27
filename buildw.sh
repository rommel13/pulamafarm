#!/bin/bash

# Build script for Ubuntu - builds the Angular web project for production

set -e  # Exit on first error

echo "========================================"
echo "Building Angular Web Project (Production)"
echo "========================================"

# Check if Node.js and npm are installed
if ! command -v node > /dev/null 2>&1; then
    echo "ERROR: Node.js is not installed."
    echo "Install with: sudo apt install -y nodejs npm"
    exit 1
fi

if ! command -v npm > /dev/null 2>&1; then
    echo "ERROR: npm is not installed."
    echo "Install with: sudo apt install -y npm"
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Navigate to the web project directory
WEB_DIR="web/pulama-farm"

if [ ! -d "$WEB_DIR" ]; then
    echo "ERROR: Directory $WEB_DIR does not exist."
    exit 1
fi

cd "$WEB_DIR" || { echo "Failed to navigate to $WEB_DIR"; exit 1; }

# Check if node_modules exists and has dependencies
if [ ! -d "node_modules" ] || [ "$(ls -A node_modules 2>/dev/null | wc -l)" -eq 0 ]; then
    echo "Installing npm dependencies..."
    npm install --production=false
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies."
        exit 1
    fi
else
    echo "Dependencies already installed. Skipping installation."
fi

# Build the project for production
echo ""
echo "Building Angular project for production..."
ng build --configuration=production

if [ $? -ne 0 ]; then
    echo "ERROR: Build failed."
    exit 1
fi

echo ""
echo "========================================"
echo "Build completed successfully!"
echo "Output directory: dist/"
ls -la dist/
echo "========================================"