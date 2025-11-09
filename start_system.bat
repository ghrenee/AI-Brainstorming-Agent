@echo off
echo ====================================
echo AI Brainstorming Agent - Quick Start
echo ====================================
echo.

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Python found:
python --version
echo [✓] Node.js found:
node --version
echo.

REM Check if backend dependencies are installed
if not exist "backend\venv\" (
    echo [*] Creating Python virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    echo [*] Installing backend dependencies...
    pip install -r requirements.txt
    cd ..
) else (
    echo [✓] Backend virtual environment found
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules\" (
    echo [*] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
) else (
    echo [✓] Frontend dependencies found
)

echo.
echo ====================================
echo Starting Services...
echo ====================================
echo.

REM Start backend in background
echo [*] Starting backend server on http://localhost:8000
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo [*] Starting frontend server on http://localhost:5173
start "Frontend Server" cmd /k "cd frontend && npm run dev"

REM Wait for frontend to start
timeout /t 5 /nobreak >nul

REM Open browser
echo [*] Opening application in browser...
start http://localhost:5173

echo.
echo ====================================
echo Services Started Successfully!
echo ====================================
echo Backend API: http://localhost:8000/docs
echo Frontend UI: http://localhost:5173
echo.
echo Press any key to stop all services...
pause >nul

REM Kill both servers when user presses a key
taskkill /FI "WindowTitle eq Backend Server*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Frontend Server*" /T /F >nul 2>&1

echo.
echo Services stopped.
pause
