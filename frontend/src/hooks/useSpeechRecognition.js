/**
 * Speech Recognition Hook
 * Custom hook for Web Speech API integration
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      // Initialize speech recognition
      const recognition = new SpeechRecognition();
      
      // Configure recognition settings
      recognition.continuous = true; // Keep listening
      recognition.interimResults = true; // Get partial results
      recognition.lang = 'en-US'; // Set language
      recognition.maxAlternatives = 1; // Number of alternative results
      
      // Event handlers
      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setError(null);
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update transcript with final or interim results
        const currentTranscript = finalTranscript || interimTranscript;
        if (currentTranscript.trim()) {
          setTranscript(currentTranscript.trim());
          
          // Clear transcript after a delay if no new speech
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(() => {
            if (finalTranscript) {
              // Keep final transcript for a bit longer
              setTimeout(() => setTranscript(''), 2000);
            }
          }, 1000);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Speech recognition error';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error occurred during speech recognition.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not allowed.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        setError(errorMessage);
        setIsListening(false);
      };
      
      recognition.onnomatch = () => {
        console.log('No speech match found');
        setError('No speech recognized. Please try again.');
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Start listening function
  const startListening = useCallback(async () => {
    if (!isSupported || !recognitionRef.current) {
      throw new Error('Speech recognition not supported');
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Clear previous transcript and errors
      setTranscript('');
      setError(null);
      
      // Start recognition
      recognitionRef.current.start();
    } catch (err) {
      const errorMessage = err.name === 'NotAllowedError' 
        ? 'Microphone permission denied. Please allow microphone access and try again.'
        : `Failed to start speech recognition: ${err.message}`;
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isSupported]);

  // Stop listening function
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Restart listening (useful for continuous operation)
  const restartListening = useCallback(async () => {
    if (isListening) {
      stopListening();
      // Wait a bit before restarting
      setTimeout(() => {
        startListening().catch(console.error);
      }, 100);
    }
  }, [isListening, stopListening, startListening]);

  // Clear transcript manually
  const clearTranscript = useCallback(() => {
    setTranscript('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    restartListening,
    clearTranscript
  };
};

export default useSpeechRecognition;