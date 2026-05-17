# Teams Accessibility Tool - Frontend

React.js frontend application providing real-time captioning and ASL support for deaf and hard-of-hearing users.

## Features

- 🎤 **Real-time Speech Recognition**: Uses Web Speech API for live transcription
- 🤟 **ASL Text Transformation**: Converts speech to simplified ASL format
- 🎨 **Glassmorphism Design**: Modern UI with Microsoft Teams inspired colors
- 📱 **Responsive Layout**: Works on desktop, tablet, and mobile devices
- 🔄 **WebSocket Integration**: Real-time communication with backend
- 🛡️ **Error Handling**: Comprehensive error boundaries and user feedback
- ♿ **Accessibility**: WCAG compliant with screen reader support

## Tech Stack

- **React 18**: Modern React with hooks and functional components
- **Web Speech API**: Browser-based speech recognition
- **WebSocket**: Real-time communication
- **CSS3**: Custom styles with glassmorphism effects
- **Responsive Design**: Mobile-first approach

## Project Structure

```
frontend/
├── public/
│   ├── index.html          # Main HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # React components
│   │   ├── Header.js       # App header and navigation
│   │   ├── CaptionDisplay.js # Live captions and ASL display
│   │   ├── ControlPanel.js # Recording controls and settings
│   │   ├── StatusIndicator.js # Connection and status display
│   │   └── ErrorBoundary.js # Error handling component
│   ├── hooks/              # Custom React hooks
│   │   ├── useSpeechRecognition.js # Speech API integration
│   │   └── useWebSocket.js # WebSocket management
│   ├── services/           # API and external services
│   │   └── apiService.js   # Backend API communication
│   ├── styles/             # CSS stylesheets
│   │   ├── index.css       # Global styles and variables
│   │   ├── App.css         # Main app layout
│   │   ├── Header.css      # Header component styles
│   │   ├── CaptionDisplay.css # Caption display styles
│   │   ├── ControlPanel.css # Control panel styles
│   │   ├── StatusIndicator.css # Status indicator styles
│   │   └── ErrorBoundary.css # Error boundary styles
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
├── package.json            # Dependencies and scripts
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 16 or higher
- npm or yarn package manager
- Modern web browser (Chrome, Edge, Safari)

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

The application will open at `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (irreversible)

## Browser Support

### ✅ Supported Browsers

- **Chrome 25+** - Full support including speech recognition
- **Edge 79+** - Full support including speech recognition  
- **Safari 14.1+** - Full support including speech recognition

### ❌ Unsupported Browsers

- **Firefox** - Web Speech API not supported
- **Internet Explorer** - Not supported

## Features Overview

### Speech Recognition

The application uses the Web Speech API for real-time speech-to-text conversion:

- Continuous listening mode
- Interim and final results
- Automatic microphone permission handling
- Error recovery and reconnection

### ASL Transformation

Text is automatically converted to simplified ASL format:

- Removes articles (a, an, the)
- Removes auxiliary verbs (is, are, was, were, etc.)
- Converts to uppercase
- Preserves essential meaning

**Example:**
```
Input: "The cat is sitting on the mat"
Output: "CAT SITTING ON MAT"
```

### Real-time Communication

WebSocket connection provides:

- Live caption streaming
- ASL text transformation
- Connection status monitoring
- Automatic reconnection

### Responsive Design

The UI adapts to different screen sizes:

- **Desktop**: Side-by-side layout with control panel
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Single column with touch-friendly controls

## Component Architecture

### App.js
Main application component that orchestrates all functionality:
- State management for captions and settings
- Integration of speech recognition and WebSocket
- Error handling and user feedback

### Custom Hooks

**useSpeechRecognition**
- Manages Web Speech API integration
- Handles browser compatibility
- Provides speech recognition state and controls

**useWebSocket**
- Manages WebSocket connection lifecycle
- Handles message sending and receiving
- Provides connection status and error handling

### Components

**Header**
- Application branding and navigation
- Information modal with usage instructions

**CaptionDisplay**
- Live speech captions display
- ASL text transformation display
- Caption history with timestamps

**ControlPanel**
- Start/stop recording controls
- Caption enable/disable toggle
- Action buttons (test, clear history)
- Browser compatibility information

**StatusIndicator**
- Connection status (connected/disconnected/error)
- Recording status (recording/idle)
- Browser support status

**ErrorBoundary**
- Catches and handles React component errors
- Provides fallback UI with recovery options
- Development mode error details

## Styling and Design

### Design System

The application uses a comprehensive design system with:

- **CSS Custom Properties**: Consistent colors, spacing, and typography
- **Glassmorphism Effects**: Modern glass-like UI elements
- **Microsoft Teams Colors**: Purple/pink gradient theme (#6264A7)
- **Responsive Grid**: Flexible layouts for all screen sizes

### Accessibility Features

- **WCAG Compliance**: Semantic HTML and ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper heading structure and descriptions
- **High Contrast Mode**: Enhanced visibility for users with visual impairments
- **Reduced Motion**: Respects user motion preferences

### Animation and Interactions

- **Smooth Transitions**: CSS transitions for hover and focus states
- **Loading States**: Visual feedback during operations
- **Pulse Animations**: Recording indicators and live status
- **Glassmorphism**: Backdrop blur effects and transparency

## API Integration

### Backend Communication

The frontend communicates with the FastAPI backend through:

**REST API Endpoints:**
- `GET /` - Health check
- `POST /api/transform-asl` - Transform text to ASL format

**WebSocket Connection:**
- `ws://localhost:8000/ws` - Real-time caption streaming

### Error Handling

Comprehensive error handling for:
- Network connectivity issues
- Microphone permission denied
- Browser compatibility problems
- Backend service unavailability

## Development

### Code Style

- **ES6+ JavaScript**: Modern JavaScript features
- **Functional Components**: React hooks instead of class components
- **CSS Modules**: Scoped component styles
- **Semantic HTML**: Accessible markup structure

### Performance Optimizations

- **React.memo**: Prevent unnecessary re-renders
- **useCallback/useMemo**: Optimize expensive operations
- **Lazy Loading**: Code splitting for better performance
- **Debounced Updates**: Efficient speech recognition handling

### Testing

The application includes:
- Component unit tests
- Integration tests for hooks
- End-to-end testing setup
- Accessibility testing

## Deployment

### Production Build

```bash
npm run build
```

Creates optimized production build in `build/` directory.

### Environment Variables

Create `.env` file for configuration:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws
```

### Hosting Options

The built application can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## Troubleshooting

### Common Issues

**Speech Recognition Not Working**
- Ensure using supported browser (Chrome, Edge, Safari)
- Check microphone permissions
- Verify HTTPS connection (required for speech API)

**WebSocket Connection Failed**
- Verify backend server is running on port 8000
- Check firewall settings
- Ensure WebSocket endpoint is accessible

**Styling Issues**
- Clear browser cache
- Check for CSS conflicts
- Verify CSS custom properties support

### Browser Permissions

The application requires:
- **Microphone Access**: For speech recognition
- **Network Access**: For backend communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Add tests for new features
5. Submit a pull request

## License

MIT License - see LICENSE file for details