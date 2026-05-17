/**
 * Teams Accessibility Tool - Main Application Component
 * Provides real-time captioning and ASL support interface
 */

import React, { useState, useEffect } from 'react';
import './styles/App.css';

// Import custom components
import Header from './components/Header';
import CaptionDisplay from './components/CaptionDisplay';
import ControlPanel from './components/ControlPanel';
import StatusIndicator from './components/StatusIndicator';
import ErrorBoundary from './components/ErrorBoundary';

// Import custom hooks
import useSpeechRecognition from './hooks/useSpeechRecognition';
import useWebSocket from './hooks/useWebSocket';

// Import services
import { apiService } from './services/apiService';

function App() {
  // Application state
  const [isRecording, setIsRecording] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [currentCaption, setCurrentCaption] = useState('');
  const [currentASL, setCurrentASL] = useState('');
  const [captionHistory, setCaptionHistory] = useState([]);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Custom hooks for speech recognition and WebSocket
  const {
    isSupported: speechSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
    error: speechError
  } = useSpeechRecognition();

  const {
    isConnected,
    sendMessage,
    lastMessage,
    error: wsError
  } = useWebSocket('ws://localhost:8000/ws');

  // Update connection status
  useEffect(() => {
    if (isConnected) {
      setConnectionStatus('connected');
    } else if (wsError) {
      setConnectionStatus('error');
    } else {
      setConnectionStatus('connecting');
    }
  }, [isConnected, wsError]);

  // Handle speech recognition transcript updates
  useEffect(() => {
    if (transcript && transcript.trim()) {
      setCurrentCaption(transcript);
      
      // Send to backend for ASL transformation if WebSocket is connected
      if (isConnected && captionsEnabled) {
        sendMessage({
          type: 'caption',
          text: transcript,
          client_id: 'main-client',
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [transcript, isConnected, captionsEnabled, sendMessage]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        
        if (data.type === 'caption_processed') {
          setCurrentASL(data.asl_text);
          
          // Add to history
          const historyItem = {
            id: Date.now(),
            timestamp: data.timestamp,
            original: data.original_text,
            asl: data.asl_text
          };
          
          setCaptionHistory(prev => [historyItem, ...prev.slice(0, 49)]); // Keep last 50 items
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    }
  }, [lastMessage]);

  // Handle errors from speech recognition or WebSocket
  useEffect(() => {
    if (speechError) {
      setError(`Speech Recognition Error: ${speechError}`);
    } else if (wsError) {
      setError(`Connection Error: ${wsError}`);
    } else {
      setError(null);
    }
  }, [speechError, wsError]);

  // Start/Stop recording handler
  const handleRecordingToggle = async () => {
    if (!speechSupported) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      if (isRecording) {
        stopListening();
        setIsRecording(false);
      } else {
        await startListening();
        setIsRecording(true);
        setError(null);
      }
    } catch (err) {
      setError(`Failed to ${isRecording ? 'stop' : 'start'} recording: ${err.message}`);
    }
  };

  // Toggle captions enabled/disabled
  const handleCaptionsToggle = () => {
    setCaptionsEnabled(!captionsEnabled);
    if (!captionsEnabled) {
      setCurrentCaption('');
      setCurrentASL('');
    }
  };

  // Clear caption history
  const handleClearHistory = () => {
    setCaptionHistory([]);
    setCurrentCaption('');
    setCurrentASL('');
  };

  // Test ASL transformation (for demonstration)
  const handleTestASL = async () => {
    try {
      const testText = "The cat is sitting on the mat";
      const response = await apiService.transformToASL(testText);
      
      const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        original: response.original_text,
        asl: response.asl_text
      };
      
      setCaptionHistory(prev => [historyItem, ...prev.slice(0, 49)]);
      setCurrentCaption(response.original_text);
      setCurrentASL(response.asl_text);
    } catch (err) {
      setError(`Test failed: ${err.message}`);
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        {/* Header */}
        <Header />
        
        {/* Status Indicator */}
        <StatusIndicator 
          connectionStatus={connectionStatus}
          isRecording={isRecording}
          speechSupported={speechSupported}
        />
        
        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
              <button 
                className="error-close"
                onClick={() => setError(null)}
                aria-label="Close error message"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className="main-content">
          {/* Caption Display */}
          <CaptionDisplay
            currentCaption={currentCaption}
            currentASL={currentASL}
            captionHistory={captionHistory}
            captionsEnabled={captionsEnabled}
          />
          
          {/* Control Panel */}
          <ControlPanel
            isRecording={isRecording}
            captionsEnabled={captionsEnabled}
            onRecordingToggle={handleRecordingToggle}
            onCaptionsToggle={handleCaptionsToggle}
            onClearHistory={handleClearHistory}
            onTestASL={handleTestASL}
            speechSupported={speechSupported}
          />
        </main>
        
        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p>Teams Accessibility Tool - Empowering inclusive communication</p>
            <p className="footer-note">
              Works best with Chrome, Edge, or Safari browsers
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;