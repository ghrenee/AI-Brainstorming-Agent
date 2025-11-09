#!/usr/bin/env python3
"""
AI Brainstorming Agent - Quick Start Script
Cross-platform startup script for both backend and frontend services
"""

import os
import sys
import subprocess
import time
import webbrowser
import shutil
from pathlib import Path

def print_header():
    print("=" * 50)
    print("AI Brainstorming Agent - Quick Start")
    print("=" * 50)
    print()

def check_command(command, name):
    """Check if a command exists in PATH"""
    if shutil.which(command):
        try:
            result = subprocess.run(
                [command, "--version"],
                capture_output=True,
                text=True
            )
            print(f"[✓] {name} found: {result.stdout.strip().split()[0]}")
            return True
        except Exception as e:
            print(f"[✓] {name} found")
            return True
    return False

def check_prerequisites():
    """Check if Python and Node.js are installed"""
    print("Checking prerequisites...")
    print()

    # Check Python
    python_found = check_command("python", "Python") or check_command("python3", "Python")
    if not python_found:
        print("[ERROR] Python is not installed or not in PATH")
        print("Please install Python 3.8+ from https://www.python.org/downloads/")
        return False

    # Check Node.js
    if not check_command("node", "Node.js"):
        print("[ERROR] Node.js is not installed or not in PATH")
        print("Please install Node.js from https://nodejs.org/")
        return False

    print()
    return True

def setup_backend():
    """Setup backend virtual environment and dependencies"""
    backend_dir = Path("backend")
    venv_dir = backend_dir / "venv"

    if not venv_dir.exists():
        print("[*] Creating Python virtual environment...")
        python_cmd = "python3" if shutil.which("python3") else "python"
        subprocess.run([python_cmd, "-m", "venv", str(venv_dir)])

        # Determine pip command based on platform
        if sys.platform == "win32":
            pip_cmd = str(venv_dir / "Scripts" / "pip.exe")
        else:
            pip_cmd = str(venv_dir / "bin" / "pip")

        print("[*] Installing backend dependencies...")
        subprocess.run([pip_cmd, "install", "-r", str(backend_dir / "requirements.txt")])
    else:
        print("[✓] Backend virtual environment found")

def setup_frontend():
    """Setup frontend dependencies"""
    frontend_dir = Path("frontend")
    node_modules = frontend_dir / "node_modules"

    if not node_modules.exists():
        print("[*] Installing frontend dependencies...")
        subprocess.run(["npm", "install"], cwd=str(frontend_dir))
    else:
        print("[✓] Frontend dependencies found")

def start_backend():
    """Start backend server"""
    print("[*] Starting backend server on http://localhost:8000")

    backend_dir = Path("backend")
    venv_dir = backend_dir / "venv"

    # Determine uvicorn command based on platform
    if sys.platform == "win32":
        uvicorn_cmd = str(venv_dir / "Scripts" / "uvicorn.exe")
    else:
        uvicorn_cmd = str(venv_dir / "bin" / "uvicorn")

    # Start backend process
    backend_process = subprocess.Popen(
        [uvicorn_cmd, "main:app", "--reload", "--port", "8000"],
        cwd=str(backend_dir)
    )

    return backend_process

def start_frontend():
    """Start frontend server"""
    print("[*] Starting frontend server on http://localhost:5173")

    frontend_dir = Path("frontend")

    # Start frontend process
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=str(frontend_dir)
    )

    return frontend_process

def open_browser():
    """Open browser to frontend URL"""
    print("[*] Opening application in browser...")
    time.sleep(2)  # Wait for servers to be ready
    webbrowser.open("http://localhost:5173")

def main():
    """Main execution flow"""
    print_header()

    # Check prerequisites
    if not check_prerequisites():
        sys.exit(1)

    # Setup services
    setup_backend()
    setup_frontend()

    print()
    print("=" * 50)
    print("Starting Services...")
    print("=" * 50)
    print()

    # Start services
    backend_process = start_backend()
    time.sleep(3)  # Wait for backend to start

    frontend_process = start_frontend()
    time.sleep(5)  # Wait for frontend to start

    # Open browser
    open_browser()

    print()
    print("=" * 50)
    print("Services Started Successfully!")
    print("=" * 50)
    print("Backend API: http://localhost:8000/docs")
    print("Frontend UI: http://localhost:5173")
    print()
    print("Press Ctrl+C to stop all services...")

    try:
        # Keep script running and wait for interrupt
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\nStopping services...")
        backend_process.terminate()
        frontend_process.terminate()

        # Wait for processes to terminate
        backend_process.wait()
        frontend_process.wait()

        print("Services stopped.")
        sys.exit(0)

if __name__ == "__main__":
    main()
