#!/bin/bash

# Teams Accessibility Tool - Setup Script
# Automated setup for both frontend and backend

echo "🤟 Teams Accessibility Tool - Setup Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if commands exist
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed. Please install $1 and try again."
        exit 1
    fi
}

# Check prerequisites
print_status "Checking prerequisites..."

check_command "node"
check_command "npm"
check_command "python3"
check_command "pip"

print_success "All prerequisites found!"

# Setup Backend
print_status "Setting up backend..."

cd backend

# Create virtual environment
print_status "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
print_status "Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed successfully!"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

cd ..

# Setup Frontend
print_status "Setting up frontend..."

cd frontend

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed successfully!"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Create start scripts
print_status "Creating start scripts..."

# Backend start script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "Starting Teams Accessibility Tool Backend..."
cd backend
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
EOF

# Frontend start script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "Starting Teams Accessibility Tool Frontend..."
cd frontend
npm start
EOF

# Make scripts executable
chmod +x start-backend.sh
chmod +x start-frontend.sh

print_success "Start scripts created!"

# Create Windows batch files
cat > start-backend.bat << 'EOF'
@echo off
echo Starting Teams Accessibility Tool Backend...
cd backend
call venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
EOF

cat > start-frontend.bat << 'EOF'
@echo off
echo Starting Teams Accessibility Tool Frontend...
cd frontend
npm start
pause
EOF

print_success "Windows batch files created!"

# Setup complete
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend server:"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "   ./start-backend.bat  (or double-click start-backend.bat)"
else
    echo "   ./start-backend.sh"
fi
echo ""
echo "2. In a new terminal, start the frontend:"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "   ./start-frontend.bat  (or double-click start-frontend.bat)"
else
    echo "   ./start-frontend.sh"
fi
echo ""
echo "3. Open your browser to: http://localhost:3000"
echo ""
echo "📋 Requirements:"
echo "   - Use Chrome, Edge, or Safari for speech recognition"
echo "   - Allow microphone permissions when prompted"
echo "   - Ensure both servers are running simultaneously"
echo ""
echo "🔧 Manual Setup (if needed):"
echo ""
echo "Backend:"
echo "   cd backend"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "   venv\\Scripts\\activate"
else
    echo "   source venv/bin/activate"
fi
echo "   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "Frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
print_success "Happy coding! 🚀"