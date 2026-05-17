@echo off
echo.
echo 🤟 Teams Accessibility Tool - Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js and try again.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python and try again.
    pause
    exit /b 1
)

echo [INFO] All prerequisites found!
echo.

REM Setup Backend
echo [INFO] Setting up backend...
cd backend

REM Create virtual environment
echo [INFO] Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment and install dependencies
echo [INFO] Installing Python dependencies...
call venv\Scripts\activate
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

echo [SUCCESS] Backend dependencies installed successfully!
cd ..

REM Setup Frontend
echo [INFO] Setting up frontend...
cd frontend

REM Install Node.js dependencies
echo [INFO] Installing Node.js dependencies...
npm install

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [SUCCESS] Frontend dependencies installed successfully!
cd ..

REM Create start scripts
echo [INFO] Creating start scripts...

REM Backend start script
echo @echo off > start-backend.bat
echo echo Starting Teams Accessibility Tool Backend... >> start-backend.bat
echo cd backend >> start-backend.bat
echo call venv\Scripts\activate >> start-backend.bat
echo uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 >> start-backend.bat
echo pause >> start-backend.bat

REM Frontend start script
echo @echo off > start-frontend.bat
echo echo Starting Teams Accessibility Tool Frontend... >> start-frontend.bat
echo cd frontend >> start-frontend.bat
echo npm start >> start-frontend.bat
echo pause >> start-frontend.bat

echo [SUCCESS] Start scripts created!
echo.

REM Setup complete
echo 🎉 Setup Complete!
echo ==================
echo.
echo To start the application:
echo.
echo 1. Start the backend server:
echo    Double-click start-backend.bat
echo.
echo 2. Start the frontend (in a new window):
echo    Double-click start-frontend.bat
echo.
echo 3. Open your browser to: http://localhost:3000
echo.
echo 📋 Requirements:
echo    - Use Chrome, Edge, or Safari for speech recognition
echo    - Allow microphone permissions when prompted
echo    - Ensure both servers are running simultaneously
echo.
echo 🔧 Manual Setup (if needed):
echo.
echo Backend:
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
echo.
echo Frontend:
echo    cd frontend
echo    npm start
echo.
echo [SUCCESS] Happy coding! 🚀
echo.
pause