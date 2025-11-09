# 🚀 Quick Start Guide

## Windows Users

### Option 1: Using Batch File (Easiest)
```bash
start_system.bat
```

### Option 2: Using Python Script
```bash
python start_system.py
```

### Option 3: Using npm
```bash
npm start
```

## Linux/Mac Users

### Option 1: Using Shell Script
```bash
chmod +x start_system.sh
./start_system.sh
```

### Option 2: Using Python Script
```bash
python3 start_system.py
```

### Option 3: Using npm
```bash
npm start
```

## Manual Start (Alternative)

If the scripts don't work, you can start manually:

### Terminal 1 - Backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Troubleshooting

### Python not found
- Install Python 3.11+ from https://www.python.org/
- Make sure Python is added to PATH

### Node.js not found
- Install Node.js 18+ from https://nodejs.org/
- Make sure Node.js is added to PATH

### Port already in use
- Backend uses port 8000
- Frontend uses port 5173
- Close other applications using these ports or change the ports in the scripts

### Dependencies not installing
- Make sure you have internet connection
- Try running `pip install -r requirements.txt` manually in backend directory
- Try running `npm install` manually in frontend directory

## Stopping the Servers

- Press `Ctrl+C` in the terminal where the script is running
- Or close the terminal windows
- The script will automatically stop both servers

## Next Steps

1. Open http://localhost:5173 in your browser
2. Enter your name and brainstorming topic
3. Start brainstorming!

For more details, see [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)

