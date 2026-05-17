/**
 * Status Indicator Component
 * Shows connection status, recording status, and browser support
 */

import React from 'react';
import '../styles/StatusIndicator.css';

const StatusIndicator = ({ connectionStatus, isRecording, speechSupported }) => {
  // Get status display information
  const getConnectionInfo = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: '🟢',
          text: 'Connected',
          className: 'connected'
        };
      case 'connecting':
        return {
          icon: '🟡',
          text: 'Connecting...',
          className: 'connecting'
        };
      case 'error':
        return {
          icon: '🔴',
          text: 'Connection Error',
          className: 'error'
        };
      default:
        return {
          icon: '⚪',
          text: 'Disconnected',
          className: 'disconnected'
        };
    }
  };

  const connectionInfo = getConnectionInfo();

  return (
    <div className="status-indicator">
      <div className="status-bar">
        {/* Connection Status */}
        <div className={`status-item connection-status ${connectionInfo.className}`}>
          <span className="status-icon">{connectionInfo.icon}</span>
          <span className="status-text">{connectionInfo.text}</span>
        </div>

        {/* Recording Status */}
        <div className={`status-item recording-status ${isRecording ? 'recording' : 'idle'}`}>
          <span className="status-icon">
            {isRecording ? '🔴' : '⚪'}
          </span>
          <span className="status-text">
            {isRecording ? 'Recording' : 'Idle'}
          </span>
          {isRecording && (
            <div className="recording-pulse">
              <div className="pulse-ring"></div>
            </div>
          )}
        </div>

        {/* Browser Support Status */}
        <div className={`status-item browser-status ${speechSupported ? 'supported' : 'unsupported'}`}>
          <span className="status-icon">
            {speechSupported ? '✅' : '❌'}
          </span>
          <span className="status-text">
            {speechSupported ? 'Browser Supported' : 'Browser Not Supported'}
          </span>
        </div>

        {/* Real-time Indicator */}
        {isRecording && (
          <div className="realtime-indicator">
            <div className="realtime-dot"></div>
            <span className="realtime-text">LIVE</span>
          </div>
        )}
      </div>

      {/* Additional Status Information */}
      <div className="status-details">
        {!speechSupported && (
          <div className="status-warning">
            <span className="warning-icon">⚠️</span>
            <span className="warning-text">
              Please use Chrome, Edge, or Safari for speech recognition support
            </span>
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="status-warning">
            <span className="warning-icon">⚠️</span>
            <span className="warning-text">
              Backend connection failed. Please ensure the server is running on port 8000
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator;