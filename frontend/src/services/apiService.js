/**
 * API Service
 * Handles HTTP requests to the backend API
 */

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  }

  /**
   * Make a generic API request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise} - Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      return data;
    } catch (error) {
      console.error(`API Error for ${url}:`, error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Additional options
   * @returns {Promise} - Response data
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} options - Additional options
   * @returns {Promise} - Response data
   */
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Health check endpoint
   * @returns {Promise} - Health status
   */
  async healthCheck() {
    return this.get('/');
  }

  /**
   * Transform text to ASL format
   * @param {string} text - Text to transform
   * @returns {Promise} - Transformation result
   */
  async transformToASL(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required and must be a string');
    }

    if (text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    if (text.length > 1000) {
      throw new Error('Text is too long (maximum 1000 characters)');
    }

    return this.post('/api/transform-asl', { text: text.trim() });
  }

  /**
   * Get server statistics
   * @returns {Promise} - Server stats
   */
  async getStats() {
    return this.get('/api/stats');
  }

  /**
   * Test connection to the backend
   * @returns {Promise<boolean>} - Connection status
   */
  async testConnection() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Batch transform multiple texts to ASL
   * @param {string[]} texts - Array of texts to transform
   * @returns {Promise} - Array of transformation results
   */
  async batchTransformToASL(texts) {
    if (!Array.isArray(texts)) {
      throw new Error('Texts must be an array');
    }

    const promises = texts.map(text => this.transformToASL(text));
    return Promise.all(promises);
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing purposes
export default ApiService;