@echo off
REM Firebase Storage Deployment Script for Windows
REM Run this from the project root to deploy storage rules

echo.
echo 🚀 Deploying Firebase Storage Rules...
echo.
echo Checking Firebase CLI installation...

REM Check if firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Firebase CLI not found. Installing...
    call npm install -g firebase-tools
)

echo.
echo 📋 Deploying storage rules to Firebase project: gopicnic-a258a
echo.

REM Deploy only storage rules
call firebase deploy --only storage

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Storage rules deployed successfully!
    echo.
    echo Next steps:
    echo 1. Go to Firebase Console: https://console.firebase.google.com/project/gopicnic-a258a/storage
    echo 2. Verify the Rules tab shows your new rules
    echo 3. Test profile image upload in the app
    echo.
    pause
) else (
    echo.
    echo ❌ Deployment failed. Check the error above.
    echo.
    echo Troubleshooting:
    echo 1. Make sure you're logged in: firebase login
    echo 2. Make sure you're in the correct project directory
    echo 3. Check that storage.rules file exists
    echo.
    pause
)
