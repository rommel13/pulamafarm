@echo off
echo Building production version of Angular application...
cd \dev\konamamaki\web\pulama-farm
call npx ng build pulama-farm --configuration production
echo.
echo Build complete.
pause