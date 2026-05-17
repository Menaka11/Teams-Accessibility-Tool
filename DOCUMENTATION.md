# Teams Accessibility Tool - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Setup and Installation](#setup-and-installation)
4. [Usage Guide](#usage-guide)
5. [API Documentation](#api-documentation)
6. [Frontend Components](#frontend-components)
7. [Backend Services](#backend-services)
8. [ASL Transformation Logic](#asl-transformation-logic)
9. [Browser Compatibility](#browser-compatibility)
10. [Troubleshooting](#troubleshooting)
11. [Development Guide](#development-guide)
12. [Deployment](#deployment)

## Project Overview

The Teams Accessibility Tool is a full-stack web application designed to provide real-time captioning and ASL (American Sign Language) support for deaf and hard-of-hearing users during online meetings. The application features a modern glassmorphism design inspired by Microsoft Teams.

### Key Features

- **Real-time Speech Recognition**: Uses Web Speech API for live transcription
- **ASL Text Transformation**: Converts speech to simplified ASL format
- **Modern UI Design**: Glassmorphism effects with purple/pink gradients
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **WebSocket Communication**: Real-time updates between frontend and backend
- **Comprehensive Error Handling**: User-friendly error messages and recovery
- **Accessibility Compliant**: WCAG guidelines with screen reader support

### Technology Stack

**Frontend:**
- React.js 18
- Web Speech API
- WebSocket
- CSS3 with Glassmorphism
- Responsive Design

**Backend:**
- Python 3.8+
- FastAPI
- WebSocket support
- Uvicorn ASGI server

## Architecture

```
┌─────────────────┐    WebSocket/HTTP    ┌─────────────────┐
│                 │ ◄─────────────────► │                 │
│   React.js      │                     │   FastAPI       │
│   Frontend      │                     │   Backend       │
│                 │                     │                 │
│ - Speech API    │                     │ - ASL Transform │
│ - WebSocket     │                     │ - WebSocket     │
│ - UI Components │                     │ - REST API      │
└─────────────────┘                     └─────────────────┘
        │                                       │
        ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│   Web Browser   │                     │   Server        │
│                 │                     │                 │
│ - Microphone    │                     │ - Port 8000     │
│ - Speech API    │                     │ - CORS Enabled  │
│ - WebSocket     │                     │ - Auto Reload   │
└─────────────────┘                     └─────────────────┘
```

## Setup and Installation

### Prerequisites

- **Node.js 16+** and npm
- **Python 3.8+** and pip
- **Modern web browser** (Chrome, Edge, Safari)

### Automated Setup

**Windows:**
```bash
setup.bat
```

**Linux/macOS:**
```bash
./setup.sh
```

### Manual Setup

**Backend Setup:**
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm start
```

### Quick Start Scripts

After setup, use these scripts to start the application:

**Windows:**
- Double-click `start-backend.bat`
- Double-click `start-frontend.bat`

**Linux/macOS:**
- `./start-backend.sh`
- `./start-frontend.sh`

## Usage Guide

### Getting Started

1. **Start both servers** (backend on port 8000, frontend on port 3000)
2. **Open browser** to `http://localhost:3000`
3. **Allow microphone permissions** when prompted
4. **Click "Start Recording"** to begin live captions
5. **View real-time captions** and ASL text side-by-side

### Interface Overview

**Header:**
- Application branding and title
- Information button with usage instructions

**Status Bar:**
- Connection status (Connected/Disconnected/Error)
- Recording status (Recording/Idle)
- Browser support status (Supported/Not Supported)

**Main Display:**
- **Live Captions**: Real-time speech-to-text
- **ASL Text**: Simplified ASL format
- **Caption History**: Timestamped history of all captions

**Control Panel:**
- **Start/Stop Recording**: Main recording control
- **Enable/Disable Captions**: Toggle caption display
- **Test ASL**: Test transformation with sample text
- **Clear History**: Remove all caption history
- **Browser Compatibility**: Supported browser list

### ASL Transformation Examples

```
Input: "The cat is sitting on the mat"
Output: "CAT SITTING ON MAT"

Input: "I'm going to the store"
Output: "I GOING TO STORE"

Input: "She has been working hard"
Output: "SHE WORKING HARD"

Input: "Can you help me with this?"
Output: "YOU HELP ME WITH THIS?"
```

## API Documentation

### REST Endpoints

#### Health Check
```http
GET /
```

**Response:**
```json
{
  "status": "healthy",
  "message": "Teams Accessibility Tool API is running",
  "timestamp": "2024-01-01T12:00:00",
  "version": "1.0.0"
}
```

#### Transform Text to ASL
```http
POST /api/transform-asl
Content-Type: application/json

{
  "text": "The cat is sitting on the mat"
}
```

**Response:**
```json
{
  "original_text": "The cat is sitting on the mat",
  "asl_text": "CAT SITTING ON MAT",
  "timestamp": "2024-01-01T12:00:00"
}
```

#### Server Statistics
```http
GET /api/stats
```

**Response:**
```json
{
  "active_connections": 2,
  "server_time": "2024-01-01T12:00:00",
  "status": "running"
}
```

### WebSocket Communication

#### Connection
```
ws://localhost:8000/ws
```

#### Message Format

**Client to Server:**
```json
{
  "type": "caption",
  "text": "Hello world",
  "client_id": "unique-client-id",
  "timestamp": "2024-01-01T12:00:00"
}
```

**Server to Client:**
```json
{
  "type": "caption_processed",
  "original_text": "Hello world",
  "asl_text": "HELLO WORLD",
  "timestamp": "2024-01-01T12:00:00",
  "client_id": "unique-client-id"
}
```

## Frontend Components

### App.js
Main application component that orchestrates all functionality.

**Key Features:**
- State management for captions and settings
- Integration of speech recognition and WebSocket
- Error handling and user feedback
- Responsive layout management

### Custom Hooks

#### useSpeechRecognition
Manages Web Speech API integration.

**Features:**
- Browser compatibility detection
- Continuous listening mode
- Error handling and recovery
- Microphone permission management

**Usage:**
```javascript
const {
  isSupported,
  isListening,
  transcript,
  error,
  startListening,
  stopListening
} = useSpeechRecognition();
```

#### useWebSocket
Manages WebSocket connection lifecycle.

**Features:**
- Automatic connection management
- Message sending and receiving
- Connection status monitoring
- Automatic reconnection with exponential backoff

**Usage:**
```javascript
const {
  isConnected,
  lastMessage,
  error,
  sendMessage
} = useWebSocket('ws://localhost:8000/ws');
```

### Component Details

#### Header
- Application branding with animated logo
- Information modal with usage instructions
- Responsive design for mobile devices

#### CaptionDisplay
- Live speech captions with real-time updates
- ASL text transformation display
- Scrollable caption history with timestamps
- Empty state handling

#### ControlPanel
- Large recording button with visual feedback
- Toggle switches for caption settings
- Action buttons for testing and clearing
- Browser compatibility information

#### StatusIndicator
- Real-time connection status
- Recording status with pulse animation
- Browser support detection
- Error messages and warnings

#### ErrorBoundary
- Catches and handles React component errors
- Provides fallback UI with recovery options
- Development mode error details
- User-friendly error messages

## Backend Services

### FastAPI Application (main.py)
Main application entry point with CORS, WebSocket, and API routes.

**Features:**
- CORS middleware for frontend communication
- WebSocket endpoint for real-time updates
- REST API endpoints for ASL transformation
- Comprehensive error handling and logging

### ASL Transformer Service
Intelligent text processing service for ASL conversion.

**Transformation Rules:**
1. Remove articles (a, an, the)
2. Remove auxiliary verbs (is, are, was, were, have, has, had, etc.)
3. Expand contractions (can't → can not)
4. Convert to uppercase
5. Preserve essential meaning and word order

**Implementation:**
```python
class ASLTransformer:
    def transform(self, text: str) -> str:
        # Expand contractions
        expanded = self.expand_contractions(text)
        
        # Clean punctuation
        cleaned = self.clean_punctuation(expanded)
        
        # Split into words
        words = cleaned.split()
        
        # Remove articles and auxiliaries
        filtered = self.remove_articles_and_auxiliaries(words)
        
        # Join and uppercase
        return ' '.join(filtered).upper()
```

### WebSocket Manager
Handles multiple client connections for real-time communication.

**Features:**
- Connection lifecycle management
- Message broadcasting to all clients
- Automatic cleanup of disconnected clients
- Error handling and logging

## ASL Transformation Logic

### Overview
The ASL transformer converts standard English text to a simplified ASL format that follows ASL grammar patterns while maintaining readability.

### Transformation Process

1. **Contraction Expansion**
   ```
   "I'm going" → "I am going"
   "can't help" → "can not help"
   ```

2. **Article Removal**
   ```
   "the cat" → "cat"
   "a dog" → "dog"
   "an apple" → "apple"
   ```

3. **Auxiliary Verb Removal**
   ```
   "is running" → "running"
   "have eaten" → "eaten"
   "will go" → "go"
   ```

4. **Case Conversion**
   ```
   "hello world" → "HELLO WORLD"
   ```

### Supported Patterns

**Articles:** a, an, the
**Auxiliary Verbs:** is, are, was, were, am, be, been, being, have, has, had, having, will, would, shall, should, could, can, may, might, must, ought, do, does, did
**Contractions:** I'm, you're, he's, she's, it's, we're, they're, isn't, aren't, wasn't, weren't, haven't, hasn't, hadn't, won't, wouldn't, don't, doesn't, didn't, can't, couldn't, shouldn't, mustn't

### Examples

```python
# Simple sentences
"The cat is sleeping" → "CAT SLEEPING"
"I am happy" → "I HAPPY"
"She has a book" → "SHE BOOK"

# Complex sentences
"The students are studying for their exams" → "STUDENTS STUDYING FOR THEIR EXAMS"
"I can't find my keys anywhere" → "I CAN NOT FIND MY KEYS ANYWHERE"
"We will be going to the store later" → "WE GOING TO STORE LATER"

# Questions
"Are you coming to the party?" → "YOU COMING TO PARTY?"
"What time is the meeting?" → "WHAT TIME MEETING?"
```

## Browser Compatibility

### Supported Browsers

| Browser | Version | Speech API | WebSocket | Notes |
|---------|---------|------------|-----------|-------|
| Chrome | 25+ | ✅ | ✅ | Full support, recommended |
| Edge | 79+ | ✅ | ✅ | Full support |
| Safari | 14.1+ | ✅ | ✅ | Full support |
| Firefox | Any | ❌ | ✅ | No speech recognition |

### Feature Detection

The application automatically detects browser capabilities:

```javascript
// Speech recognition detection
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSupported = !!SpeechRecognition;

// WebSocket detection
const isWebSocketSupported = 'WebSocket' in window;
```

### Fallback Behavior

- **No Speech API**: Shows warning message and disables recording
- **No WebSocket**: Falls back to REST API calls
- **Old Browser**: Graceful degradation with basic functionality

## Troubleshooting

### Common Issues

#### Speech Recognition Not Working

**Symptoms:**
- "Browser Not Supported" message
- No response when speaking
- Microphone permission denied

**Solutions:**
1. Use Chrome, Edge, or Safari browser
2. Ensure HTTPS connection (required for speech API)
3. Allow microphone permissions in browser settings
4. Check microphone hardware and drivers
5. Restart browser and try again

#### WebSocket Connection Failed

**Symptoms:**
- "Connection Error" status
- No real-time updates
- Backend communication issues

**Solutions:**
1. Verify backend server is running on port 8000
2. Check firewall settings
3. Ensure WebSocket endpoint is accessible
4. Restart both frontend and backend servers
5. Check browser console for error messages

#### Backend Server Issues

**Symptoms:**
- Cannot start backend server
- Import errors
- Port already in use

**Solutions:**
1. Activate Python virtual environment
2. Install dependencies: `pip install -r requirements.txt`
3. Check if port 8000 is available
4. Use different port: `uvicorn app.main:app --port 8001`
5. Check Python version compatibility (3.8+)

#### Frontend Build Issues

**Symptoms:**
- npm install fails
- Build errors
- Module not found errors

**Solutions:**
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check Node.js version (16+)
4. Update npm: `npm install -g npm@latest`
5. Check for conflicting global packages

### Debug Mode

Enable debug logging in backend:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Enable React development mode:
```bash
REACT_APP_DEBUG=true npm start
```

### Performance Issues

**Symptoms:**
- Slow speech recognition
- Delayed WebSocket messages
- High CPU usage

**Solutions:**
1. Close unnecessary browser tabs
2. Restart browser
3. Check system resources
4. Use Chrome for best performance
5. Reduce speech recognition sensitivity

## Development Guide

### Code Structure

**Frontend Architecture:**
```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── services/      # API and external services
├── styles/        # CSS stylesheets
├── App.js         # Main application
└── index.js       # Entry point
```

**Backend Architecture:**
```
app/
├── api/           # API models and schemas
├── core/          # Core functionality
├── services/      # Business logic services
└── main.py        # FastAPI application
```

### Development Workflow

1. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

2. **Make Changes**
   - Frontend changes auto-reload in browser
   - Backend changes auto-reload with `--reload` flag

3. **Test Changes**
   - Test speech recognition functionality
   - Verify WebSocket communication
   - Check responsive design on different screen sizes

### Adding New Features

#### Frontend Component
```javascript
// src/components/NewComponent.js
import React from 'react';
import './NewComponent.css';

const NewComponent = ({ prop1, prop2 }) => {
  return (
    <div className="new-component">
      {/* Component content */}
    </div>
  );
};

export default NewComponent;
```

#### Backend Endpoint
```python
# app/main.py
@app.post("/api/new-endpoint")
async def new_endpoint(request: NewRequest):
    try:
        # Process request
        result = process_data(request.data)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Testing

#### Frontend Testing
```bash
cd frontend
npm test
```

#### Backend Testing
```bash
cd backend
pytest
```

#### Manual Testing Checklist
- [ ] Speech recognition starts/stops correctly
- [ ] ASL transformation works with various inputs
- [ ] WebSocket connection establishes and maintains
- [ ] Responsive design works on mobile
- [ ] Error handling displays appropriate messages
- [ ] Browser compatibility warnings show correctly

### Code Style

**Frontend:**
- Use functional components with hooks
- Follow React best practices
- Use semantic HTML elements
- Implement proper accessibility attributes

**Backend:**
- Follow PEP 8 Python style guide
- Use type hints for function parameters
- Implement proper error handling
- Add docstrings for all functions

## Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
```

Creates optimized production build in `build/` directory.

#### Backend
```bash
cd backend
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Environment Configuration

#### Frontend (.env)
```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_WS_URL=wss://your-api-domain.com/ws
```

#### Backend
```python
# app/core/config.py
import os

class Settings:
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 8000))
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
```

### Hosting Options

#### Frontend Hosting
- **Netlify**: Drag and drop `build/` folder
- **Vercel**: Connect GitHub repository
- **AWS S3 + CloudFront**: Static website hosting
- **GitHub Pages**: Free hosting for public repositories

#### Backend Hosting
- **Heroku**: Easy deployment with Procfile
- **AWS EC2**: Full control over server environment
- **DigitalOcean**: Simple cloud hosting
- **Railway**: Modern deployment platform

### Docker Deployment

#### Dockerfile (Backend)
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Dockerfile (Frontend)
```dockerfile
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - API_HOST=0.0.0.0
      - API_PORT=8000

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

### SSL/HTTPS Configuration

For production deployment, HTTPS is required for:
- Web Speech API functionality
- Secure WebSocket connections (WSS)
- Modern browser security requirements

#### Nginx Configuration
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

This completes the comprehensive documentation for the Teams Accessibility Tool. The application is now ready for development, testing, and deployment with full documentation coverage.