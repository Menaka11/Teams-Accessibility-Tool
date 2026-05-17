/**
 * WebSocket Hook
 * Custom hook for WebSocket connection management
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      console.log(`Connecting to WebSocket: ${url}`);
      
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        
        // Send initial ping
        ws.send(JSON.stringify({
          type: 'ping',
          timestamp: new Date().toISOString()
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          setLastMessage(event.data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          setLastMessage(event.data); // Pass raw data if JSON parsing fails
        }
      };
      
      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current); // Exponential backoff
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Failed to connect after multiple attempts. Please refresh the page.');
        }
      };
      
      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error. Please check if the server is running.');
      };
      
      wsRef.current = ws;
      
    } catch (err) {
      console.error('Error creating WebSocket connection:', err);
      setError(`Failed to create WebSocket connection: ${err.message}`);
    }
  }, [url]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        const messageString = typeof message === 'string' ? message : JSON.stringify(message);
        wsRef.current.send(messageString);
        console.log('WebSocket message sent:', message);
        return true;
      } catch (err) {
        console.error('Error sending WebSocket message:', err);
        setError(`Failed to send message: ${err.message}`);
        return false;
      }
    } else {
      console.warn('WebSocket not connected, cannot send message');
      setError('WebSocket not connected');
      return false;
    }
  }, []);

  // Get connection state
  const getConnectionState = useCallback(() => {
    if (!wsRef.current) return 'CLOSED';
    
    switch (wsRef.current.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'OPEN';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    if (url) {
      connect();
    }
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]);

  // Periodic ping to keep connection alive
  useEffect(() => {
    if (isConnected) {
      const pingInterval = setInterval(() => {
        sendMessage({
          type: 'ping',
          timestamp: new Date().toISOString()
        });
      }, 30000); // Ping every 30 seconds
      
      return () => clearInterval(pingInterval);
    }
  }, [isConnected, sendMessage]);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    connect,
    disconnect,
    connectionState: getConnectionState()
  };
};

export default useWebSocket;