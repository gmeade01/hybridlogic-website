@echo off
echo ===================================================
echo Deploying Hybrid Logic to Google Cloud / Firebase
echo ===================================================
call firebase deploy --only hosting
echo.
echo Deployment finished!
pause
