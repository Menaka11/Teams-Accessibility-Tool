/**
 * Control Panel Component
 * Main controls for recording, captions, and other actions
 */

import React from 'react';
import '../styles/ControlPanel.css';

const ControlPanel = ({
  isRecording,
  captionsEnabled,
  onRecordingToggle,
  onCaptionsToggle,
  onClearHistory,
  onTestASL,
  speechSupported
}) => {
  return (
    <div className="control-panel">
      <div className="control-section">
        <h3 className="control-title">Recording Controls</h3>
        
        {/* Main Recording Button */}
        <div className="main-controls">
          <button
            className={`record-button ${isRecording ? 'recording' : ''} ${!speechSupported ? 'disabled' : ''}`}
            onClick={onRecordingToggle}
            disabled={!speechSupported}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <div className="button-content">
              <span className="record-icon">
                {isRecording ? '⏹️' : '🎤'}
              </span>
              <span className="record-text">
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </span>
            </div>
            
            {isRecording && (
              <div className="recording-indicator">
                <div className="pulse-dot"></div>
                <span className="recording-text">LIVE</span>
              </div>
            )}
          </button>
          
          {!speechSupported && (
            <div className="unsupported-message">
              <span className="warning-icon">⚠️</span>
              Speech recognition not supported in this browser
            </div>
          )}
        </div>
      </div>

      {/* Caption Controls */}
      <div className="control-section">
        <h3 className="control-title">Caption Settings</h3>
        
        <div className="toggle-controls">
          {/* Captions Toggle */}
          <div className="toggle-item">
            <label className="toggle-label">
              <span className="toggle-text">Enable Captions</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={captionsEnabled}
                  onChange={onCaptionsToggle}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="control-section">
        <h3 className="control-title">Actions</h3>
        
        <div className="action-buttons">
          {/* Test ASL Button */}
          <button
            className="action-button test-button"
            onClick={onTestASL}
            aria-label="Test ASL transformation"
          >
            <span className="button-icon">🧪</span>
            <span className="button-text">Test ASL</span>
          </button>
          
          {/* Clear History Button */}
          <button
            className="action-button clear-button"
            onClick={onClearHistory}
            aria-label="Clear caption history"
          >
            <span className="button-icon">🗑️</span>
            <span className="button-text">Clear History</span>
          </button>
        </div>
      </div>

      {/* Browser Compatibility Info */}
      <div className="control-section">
        <div className="compatibility-info">
          <h4 className="info-title">Browser Compatibility</h4>
          <div className="browser-list">
            <div className="browser-item supported">
              <span className="browser-icon">✅</span>
              <span className="browser-name">Chrome</span>
            </div>
            <div className="browser-item supported">
              <span className="browser-icon">✅</span>
              <span className="browser-name">Edge</span>
            </div>
            <div className="browser-item supported">
              <span className="browser-icon">✅</span>
              <span className="browser-name">Safari</span>
            </div>
            <div className="browser-item unsupported">
              <span className="browser-icon">❌</span>
              <span className="browser-name">Firefox</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;