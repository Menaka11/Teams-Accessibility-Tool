"""
Pydantic models for API request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TransformRequest(BaseModel):
    """Request model for ASL text transformation"""
    text: str = Field(..., min_length=1, max_length=1000, description="Text to transform to ASL format")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "The cat is sitting on the mat"
            }
        }

class TransformResponse(BaseModel):
    """Response model for ASL text transformation"""
    original_text: str = Field(..., description="Original input text")
    asl_text: str = Field(..., description="Transformed ASL text")
    timestamp: str = Field(..., description="Transformation timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "original_text": "The cat is sitting on the mat",
                "asl_text": "CAT SITTING ON MAT",
                "timestamp": "2024-01-01T12:00:00"
            }
        }

class HealthResponse(BaseModel):
    """Response model for health check endpoint"""
    status: str = Field(..., description="Server status")
    message: str = Field(..., description="Status message")
    timestamp: str = Field(..., description="Current server timestamp")
    version: str = Field(..., description="API version")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "message": "Teams Accessibility Tool API is running",
                "timestamp": "2024-01-01T12:00:00",
                "version": "1.0.0"
            }
        }

class WebSocketMessage(BaseModel):
    """Model for WebSocket messages"""
    type: str = Field(..., description="Message type")
    text: Optional[str] = Field(None, description="Text content")
    client_id: Optional[str] = Field(None, description="Client identifier")
    timestamp: Optional[str] = Field(None, description="Message timestamp")