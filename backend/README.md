# Teams Accessibility Tool - Backend

FastAPI backend server providing ASL transformation and WebSocket support for real-time captioning.

## Features

- **REST API**: Transform text to ASL format
- **WebSocket Support**: Real-time communication for live captions
- **ASL Transformation**: Intelligent text processing for deaf/hard-of-hearing users
- **Health Monitoring**: Server status and statistics endpoints
- **Error Handling**: Comprehensive error management and logging

## API Endpoints

### REST Endpoints

- `GET /` - Health check
- `POST /api/transform-asl` - Transform text to ASL format
- `GET /api/stats` - Server statistics
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

### WebSocket

- `WebSocket /ws` - Real-time communication endpoint

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Create Virtual Environment**
```bash
python -m venv venv
```

2. **Activate Virtual Environment**

On Windows:
```bash
venv\Scripts\activate
```

On macOS/Linux:
```bash
source venv/bin/activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Start the Server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at `http://localhost:8000`

## ASL Transformation Logic

The ASL transformer converts English text to simplified ASL format using these rules:

1. **Remove Articles**: a, an, the
2. **Remove Auxiliary Verbs**: is, are, was, were, have, has, had, will, would, etc.
3. **Expand Contractions**: can't → can not, I'm → I am
4. **Convert to Uppercase**: Final output in caps
5. **Preserve Word Order**: Maintains essential meaning

### Examples

```
Input: "The cat is sitting on the mat"
Output: "CAT SITTING ON MAT"

Input: "I'm going to the store"
Output: "I GOING TO STORE"

Input: "She has been working hard"
Output: "SHE WORKING HARD"
```

## WebSocket Communication

### Message Format

**Client to Server:**
```json
{
  "type": "caption",
  "text": "Hello world",
  "client_id": "unique-client-id"
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

## Development

### Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   └── models.py          # Pydantic models
│   ├── core/
│   │   ├── __init__.py
│   │   └── websocket_manager.py  # WebSocket connection management
│   ├── services/
│   │   ├── __init__.py
│   │   └── asl_transformer.py    # ASL text transformation
│   ├── __init__.py
│   └── main.py               # FastAPI application
├── requirements.txt
└── README.md
```

### Running in Development Mode

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The `--reload` flag enables auto-restart when code changes are detected.

### Testing the API

1. **Health Check**
```bash
curl http://localhost:8000/
```

2. **Transform Text**
```bash
curl -X POST "http://localhost:8000/api/transform-asl" \
     -H "Content-Type: application/json" \
     -d '{"text": "The cat is sitting on the mat"}'
```

3. **Interactive Documentation**
Visit `http://localhost:8000/docs` for Swagger UI

## Logging

The application uses Python's built-in logging module. Logs include:
- WebSocket connection events
- ASL transformations
- Error messages
- Server statistics

## Error Handling

The backend includes comprehensive error handling for:
- Invalid input data
- WebSocket connection issues
- Internal server errors
- Missing endpoints

## CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:3000` (React development server)
- `http://127.0.0.1:3000`

## Production Deployment

For production deployment, consider:
1. Using a production WSGI server like Gunicorn
2. Setting up proper logging configuration
3. Configuring environment variables
4. Setting up SSL/TLS certificates
5. Implementing rate limiting
6. Adding authentication if needed

Example production command:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```