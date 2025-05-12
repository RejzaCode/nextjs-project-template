@echo off
echo Installing dependencies...
call npm install --legacy-peer-deps

echo Installing Next.js globally...
call npm install -g next

echo Building the application...
call npm run electron-build --legacy-peer-deps

echo.
echo Build complete! You can find the executable in the dist folder.
echo Press any key to exit...
pause >nul
