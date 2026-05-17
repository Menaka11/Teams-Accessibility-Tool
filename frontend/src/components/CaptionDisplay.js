/**
 * Caption Display Component
 * Shows live captions, ASL text, and caption history
 */

import React, { useRef, useEffect } from 'react';
import '../styles/CaptionDisplay.css';

const CaptionDisplay = ({ 
  currentCaption, 
  currentASL, 
  captionHistory, 
  captionsEnabled 
}) => {
  const historyRef = useRef(null);

  // Auto-scroll to top when new history items are added
  useEffect(() => {
    if (historyRef.current && captionHistory.length > 0) {
      historyRef.current.scrollTop = 0;
    }
  }, [captionHistory]);

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (err) {
      return 'Invalid time';
    }
  };

  return (
    <div className="caption-display">
      {/* Live Caption Section */}
      <div className="live-captions">
        <div className="caption-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">💬</span>
              Live Captions
            </h2>
            <div className={`status-indicator ${captionsEnabled ? 'active' : 'inactive'}`}>
              {captionsEnabled ? 'ON' : 'OFF'}
            </div>
          </div>
          
          <div className="caption-content">
            {captionsEnabled ? (
              <div className="live-caption-text">
                {currentCaption || (
                  <span className="placeholder-text">
                    Click "Start Recording" to begin live captions...
                  </span>
                )}
              </div>
            ) : (
              <div className="disabled-message">
                Captions are disabled. Toggle the switch to enable.
              </div>
            )}
          </div>
        </div>

        {/* ASL Section */}
        <div className="asl-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">🤟</span>
              ASL Text
            </h2>
          </div>
          
          <div className="asl-content">
            {captionsEnabled ? (
              <div className="asl-text">
                {currentASL || (
                  <span className="placeholder-text">
                    ASL text will appear here...
                  </span>
                )}
              </div>
            ) : (
              <div className="disabled-message">
                ASL transformation disabled.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Caption History */}
      <div className="caption-history">
        <div className="history-header">
          <h3 className="history-title">
            <span className="section-icon">📝</span>
            Caption History
            {captionHistory.length > 0 && (
              <span className="history-count">({captionHistory.length})</span>
            )}
          </h3>
        </div>
        
        <div className="history-content" ref={historyRef}>
          {captionHistory.length > 0 ? (
            <div className="history-list">
              {captionHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-timestamp">
                    {formatTimestamp(item.timestamp)}
                  </div>
                  <div className="history-texts">
                    <div className="history-original">
                      <span className="text-label">Original:</span>
                      <span className="text-content">{item.original}</span>
                    </div>
                    <div className="history-asl">
                      <span className="text-label">ASL:</span>
                      <span className="text-content">{item.asl}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-history">
              <div className="empty-icon">📋</div>
              <p className="empty-message">No captions yet</p>
              <p className="empty-subtitle">
                Start recording to see your caption history here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptionDisplay;