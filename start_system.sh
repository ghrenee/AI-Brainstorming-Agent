#!/bin/bash

echo "===================================="
echo "AI Brainstorming Agent - Quick Start"
echo "===================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "[ERROR] Python is not installed"
    echo "Please install Python 3.8+ from https://www.python.org/downloads/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Determine Python command
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
else
    PYTHON_CMD=python
fi

echo "[✓] Python found:"
$PYTHON_CMD --version
echo "[✓] Node.js found:"
node --version
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/venv" ]; then
    echo "[*] Creating Python virtual environment..."
    cd backend
    $PYTHON_CMD -m venv venv
    source venv/bin/activate
    echo "[*] Installing backend dependencies..."
    pip install -r requirements.txt
    cd ..
else
    echo "[✓] Backend virtual environment found"
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "[*] Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
else
    echo "[✓] Frontend dependencies found"
fi

echo ""
echo "===================================="
echo "Starting Services..."
echo "===================================="
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "[*] Starting backend server on http://localhost:8000"
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend in background
echo "[*] Starting frontend server on http://localhost:5173"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 5

# Open browser (cross-platform)
echo "[*] Opening application in browser..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
elif command -v open &> /dev/null; then
    open http://localhost:5173
else
    echo "Please open http://localhost:5173 in your browser"
fi

echo ""
echo "===================================="
echo "Services Started Successfully!"
echo "===================================="
echo "Backend API: http://localhost:8000/docs"
echo "Frontend UI: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services..."

# Wait for user interrupt
wait
