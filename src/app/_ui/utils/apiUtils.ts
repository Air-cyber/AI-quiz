import axios from 'axios';
import { getAuthHeader } from './authUtils';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {any} data - Request body data (for POST, PUT requests)
 * @returns {Promise<any>} - API response data
 */
export const apiRequest = async (
  endpoint: string,
  method: 'get' | 'post' | 'put' | 'delete' = 'get',
  data: any = null
): Promise<any> => {
  try {
    // Get auth header with token
    const authHeader = getAuthHeader();

    // Make request with appropriate method
    let response;

    switch (method) {
      case 'get':
        response = await api.get(endpoint, { headers: authHeader });
        break;
      case 'post':
        response = await api.post(endpoint, data, { headers: authHeader });
        break;
      case 'put':
        response = await api.put(endpoint, data, { headers: authHeader });
        break;
      case 'delete':
        response = await api.delete(endpoint, { headers: authHeader });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  } catch (error: any) {
    // Handle API errors
    console.error(`API Error (${endpoint}):`, error.response?.data || error.message);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<any>} - Registration response
   */
  register: async (userData: { email: string; username?: string; password: string }) => {
    return apiRequest('/auth/register', 'post', userData);
  },

  /**
   * Login a user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<any>} - Login response
   */
  login: async (credentials: { identifier: string; password: string }) => {
    return apiRequest('/auth/login', 'post', credentials);
  },

  /**
   * Get current user profile
   * @returns {Promise<any>} - User profile data
   */
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<any>} - Updated profile
   */
  updateProfile: async (profileData: { name?: string; email?: string }) => {
    return apiRequest('/auth/profile', 'put', profileData);
  },

  /**
   * Save quiz result
   * @param {Object} resultData - Quiz result data
   * @returns {Promise<any>} - Saved result response
   */
  saveQuizResult: async (resultData: {
    subject: string;
    topic?: string;
    score: number;
    totalQuestions: number;
    testCode?: string;
    timeTaken?: number;
    rank?: number;
    totalParticipants?: number;
  }) => {
    return apiRequest('/auth/quiz-result', 'post', resultData);
  }
};

// Quiz API functions
export const quizAPI = {
  /**
   * Generate a quiz
   * @param {Object} quizParams - Quiz generation parameters
   * @returns {Promise<any>} - Generated quiz
   */
  generateQuiz: async (quizParams: { topic: string; difficulty?: string; questionCount?: number }) => {
    return apiRequest('/quiz/generate', 'post', quizParams);
  },

  /**
   * Get topics by subject
   * @param {string} subject - Subject to get topics for
   * @returns {Promise<string[]>} - List of topics for the subject
   */
  getTopicsBySubject: async (subject: string): Promise<string[]> => {
    const response = await apiRequest(`/quiz/topics/${encodeURIComponent(subject)}`, 'get');
    return response.topics || [];
  },

  /**
   * Get leaderboard for a specific test code
   * @param {string} testCode - Test code to get leaderboard for
   * @returns {Promise<any>} - Leaderboard data
   */
  getLeaderboard: async (testCode: string) => {
    return apiRequest(`/quiz/leaderboard/${encodeURIComponent(testCode)}`, 'get');
  }
};

export default api;
