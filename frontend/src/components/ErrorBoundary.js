/**
 * Error Boundary Component
 * Catches and handles React component errors gracefully
 */

import React from 'react';
import '../styles/ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    // Reload the page to recover from the error
    window.location.reload();
  };

  handleReset = () => {
    // Reset the error boundary state
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">💥</div>
            <h1 className="error-title">Oops! Something went wrong</h1>
            <p className="error-message">
              The Teams Accessibility Tool encountered an unexpected error.
            </p>
            
            <div className="error-actions">
              <button 
                className="error-button primary"
                onClick={this.handleReload}
              >
                Reload Application
              </button>
              <button 
                className="error-button secondary"
                onClick={this.handleReset}
              >
                Try Again
              </button>
            </div>

            {/* Error Details (for development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Mode)</summary>
                <div className="error-stack">
                  <h3>Error:</h3>
                  <pre>{this.state.error.toString()}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h3>Component Stack:</h3>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className="error-help">
              <h3>Troubleshooting Tips:</h3>
              <ul>
                <li>Make sure your browser supports speech recognition (Chrome, Edge, Safari)</li>
                <li>Check that the backend server is running on port 8000</li>
                <li>Ensure microphone permissions are granted</li>
                <li>Try refreshing the page or restarting your browser</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;