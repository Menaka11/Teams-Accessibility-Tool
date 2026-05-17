/**
 * Header Component
 * Application header with branding and navigation
 */

import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        {/* Logo and Title */}
        <div className="header-brand">
          <div className="logo">
            <span className="logo-icon">🤟</span>
          </div>
          <div className="brand-text">
            <h1 className="app-title">Teams Accessibility Tool</h1>
            <p className="app-subtitle">Real-Time Captioning & ASL Support</p>
          </div>
        </div>
        
        {/* Header Actions */}
        <div className="header-actions">
          <button 
            className="header-button info-button"
            onClick={() => {
              const infoText = `
Teams Accessibility Tool provides:
• Real-time speech-to-text captions
• Simplified ASL text conversion
• Caption history with timestamps
• Responsive design for all devices

ASL Transformation removes articles and auxiliary verbs:
"The cat is sitting" → "CAT SITTING"

Supported browsers: Chrome, Edge, Safari
              `.trim();
              alert(infoText);
            }}
            aria-label="Information about the application"
          >
            <span className="button-icon">ℹ️</span>
            <span className="button-text">Info</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;