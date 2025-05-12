@echo off
echo Installing dependencies...
call npm install

echo Building the application...
call npm run electron-build

echo.
echo Build complete! You can find the executable in the dist folder.
echo Press any key to exit...
pause >nul
