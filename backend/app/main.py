"""
Teams Accessibility Tool - FastAPI Backend
Main application entry point with CORS, WebSocket, and API routes
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import logging
from datetime import datetime
from typing import List, Dict, Any
import asyncio

from app.services.asl_transformer import ASLTransformer
from app.core.websocket_manager import ConnectionManager
from app.api.models import TransformRequest, TransformResponse, HealthResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Teams Accessibility Tool API",
    description="Real-time captioning and ASL support for deaf and hard-of-hearing users",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
asl_transformer = ASLTransformer()
connection_manager = ConnectionManager()

@app.get("/", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify API is running
    Returns server status and timestamp
    """
    return HealthResponse(
        status="healthy",
        message="Teams Accessibility Tool API is running",
        timestamp=datetime.now().isoformat(),
        version="1.0.0"
    )

@app.post("/api/transform-asl", response_model=TransformResponse)
async def transform_to_asl(request: TransformRequest):
    """
    Transform regular text to simplified ASL format
    
    Args:
        request: TransformRequest containing the text to transform
        
    Returns:
        TransformResponse with original and transformed text
        
    Raises:
        HTTPException: If text processing fails
    """
    try:
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Transform text to ASL format
        asl_text = asl_transformer.transform(request.text)
        
        logger.info(f"Transformed text: '{request.text}' -> '{asl_text}'")
        
        return TransformResponse(
            original_text=request.text,
            asl_text=asl_text,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error transforming text: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to transform text")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time communication
    Handles caption streaming and ASL transformation
    """
    await connection_manager.connect(websocket)
    logger.info(f"WebSocket connected. Total connections: {len(connection_manager.active_connections)}")
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Process different message types
            if message_data.get("type") == "caption":
                # Handle live caption data
                text = message_data.get("text", "")
                if text.strip():
                    # Transform to ASL
                    asl_text = asl_transformer.transform(text)
                    
                    # Prepare response
                    response = {
                        "type": "caption_processed",
                        "original_text": text,
                        "asl_text": asl_text,
                        "timestamp": datetime.now().isoformat(),
                        "client_id": message_data.get("client_id")
                    }
                    
                    # Broadcast to all connected clients
                    await connection_manager.broadcast(json.dumps(response))
                    logger.info(f"Broadcasted caption: {text[:50]}...")
            
            elif message_data.get("type") == "ping":
                # Handle ping/keepalive
                await websocket.send_text(json.dumps({
                    "type": "pong",
                    "timestamp": datetime.now().isoformat()
                }))
                
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(connection_manager.active_connections)}")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        connection_manager.disconnect(websocket)

@app.get("/api/stats")
async def get_stats():
    """
    Get current server statistics
    """
    return {
        "active_connections": len(connection_manager.active_connections),
        "server_time": datetime.now().isoformat(),
        "status": "running"
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Endpoint not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )