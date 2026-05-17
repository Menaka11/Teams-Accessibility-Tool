# Teams Accessibility Tool – Real-Time Captioning and ASL Support

A modern web application that provides real-time speech-to-text captions and simplified ASL text for deaf and hard-of-hearing users during online meetings.

## Features

- 🎤 Real-time speech recognition using Web Speech API
- 📝 Live speech captions with timestamps
- 🤟 Simplified ASL text transformation
- 🎨 Modern glassmorphism UI design
- 📱 Responsive design for desktop and mobile
- 🔄 WebSocket support for real-time updates
- 🛡️ Comprehensive error handling
- 🎯 Microsoft Teams inspired design

## Tech Stack

### Frontend
- React.js
- HTML5/CSS3
- JavaScript ES6+
- Web Speech API

### Backend
- Python 3.8+
- FastAPI
- WebSockets
- Uvicorn

## Project Structure

```
teams-accessibility-tool/
├── frontend/                 # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── README.md
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── README.md
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Modern web browser (Chrome, Edge, Safari)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open http://localhost:3000 in your browser

## Browser Support

- ✅ Chrome 25+
- ✅ Edge 79+
- ✅ Safari 14.1+
- ❌ Firefox (Web Speech API not supported)

## ASL Transformation

The application converts standard English to simplified ASL text by:
- Removing articles (a, an, the)
- Removing auxiliary verbs (is, are, was, were, have, has, had)
- Converting to uppercase
- Preserving essential meaning

**Example:**
- Input: "The cat is sitting on the mat"
- Output: "CAT SITTING ON MAT"

## API Endpoints

- `GET /` - Health check
- `POST /api/transform-asl` - Transform text to ASL format
- `WebSocket /ws` - Real-time communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details