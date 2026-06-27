@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Building Angular Web Project (Pulama FARM)
echo ========================================

REM Navigate to the web project directory
cd /d "%~dp0\..\web\pulama-farm" || (
    echo ERROR: Could not navigate to web/pulama-farm directory.
    pause
    exit /b 1
)

echo Current directory: %CD%

REM Check if node_modules exists and clean it for fresh build
if exist "node_modules" (
    echo Removing existing node_modules...
    rmdir /s /q "node_modules"
)

REM Install all dependencies
echo Installing npm dependencies...
call npm install --production || (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

echo Dependencies installed successfully.

REM Build the Angular project
echo Building Angular project...
call npm run build || (
    echo ERROR: Build failed.
    pause
    exit /b 1
)

echo ========================================
echo Build completed successfully!
echo Output directory: dist/
echo ========================================

pause