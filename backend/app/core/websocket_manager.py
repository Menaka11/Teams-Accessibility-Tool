"""
WebSocket connection manager for handling multiple client connections
"""

from fastapi import WebSocket
from typing import List
import json
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    """
    Manages WebSocket connections for real-time communication
    Handles connection lifecycle and message broadcasting
    """
    
    def __init__(self):
        # Store active WebSocket connections
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        """
        Accept and store a new WebSocket connection
        
        Args:
            websocket: The WebSocket connection to add
        """
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New WebSocket connection added. Total: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """
        Remove a WebSocket connection from active connections
        
        Args:
            websocket: The WebSocket connection to remove
        """
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket connection removed. Total: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """
        Send a message to a specific WebSocket connection
        
        Args:
            message: The message to send
            websocket: The target WebSocket connection
        """
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {str(e)}")
            self.disconnect(websocket)
    
    async def broadcast(self, message: str):
        """
        Broadcast a message to all active WebSocket connections
        Automatically removes disconnected clients
        
        Args:
            message: The message to broadcast
        """
        disconnected_connections = []
        
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Error broadcasting to connection: {str(e)}")
                disconnected_connections.append(connection)
        
        # Remove disconnected connections
        for connection in disconnected_connections:
            self.disconnect(connection)
        
        if disconnected_connections:
            logger.info(f"Removed {len(disconnected_connections)} disconnected connections")
    
    async def broadcast_json(self, data: dict):
        """
        Broadcast JSON data to all active connections
        
        Args:
            data: Dictionary to serialize and broadcast
        """
        message = json.dumps(data)
        await self.broadcast(message)
    
    def get_connection_count(self) -> int:
        """
        Get the number of active connections
        
        Returns:
            Number of active WebSocket connections
        """
        return len(self.active_connections)