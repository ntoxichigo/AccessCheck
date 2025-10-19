@echo off
echo ====================================
echo Fixing Prisma Client Initialization
echo ====================================
echo.
echo This script will:
echo 1. Stop the development server (if running)
echo 2. Regenerate Prisma Client
echo 3. Provide instructions to restart
echo.
echo Please STOP your dev server (Ctrl+C in the terminal) before continuing!
echo.
pause

echo.
echo Regenerating Prisma Client...
call npx prisma generate

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo SUCCESS! Prisma Client regenerated
    echo ====================================
    echo.
    echo Next steps:
    echo 1. Restart your development server: npm run dev
    echo 2. Test API key generation in Settings
    echo 3. The error should now be resolved!
    echo.
) else (
    echo.
    echo ====================================
    echo ERROR during Prisma generation
    echo ====================================
    echo.
    echo If you see permission errors:
    echo 1. Make sure dev server is completely stopped
    echo 2. Close any file explorers in node_modules
    echo 3. Try running this script as Administrator
    echo.
)

pause
