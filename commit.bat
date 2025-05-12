@echo off
echo Initializing git repository if not already initialized...
git init

echo Adding files to git...
git add package.json
git add next.config.js
git add build.bat

echo Committing files...
git commit -m "Add build configuration files"

echo Pushing to remote repository...
git push

echo.
echo Done! Check your GitHub repository to see the committed files.
echo Press any key to exit...
pause >nul
