@echo off
title CJ ProjectHub Auto-Push
echo ========================================================
echo        CJ ProjectHub - Auto-Push to GitHub ^& Vercel
echo ========================================================
echo.

:: Move to the directory where this batch file is located
cd /d "%~dp0"

echo [1/3] Adding changes to Git staging...
git add .
echo.

echo [2/3] Committing changes...
git commit -m "Auto-update dashboard features and WBS edits"
echo.

echo [3/3] Pushing changes to https://github.com/hailp1/PM_CJ.git...
git push -u origin main -f
echo.

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed! Please check your internet connection or GitHub credentials.
) else (
    echo.
    echo ========================================================
    echo   SUCCESS! Pushed successfully to GitHub.
    echo   Vercel is now rebuilding. Check live page in 1 minute.
    echo ========================================================
)

echo.
pause
