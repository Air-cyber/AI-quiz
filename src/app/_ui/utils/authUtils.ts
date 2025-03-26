// Authentication utility functions for client-side

// Define a User type for better type checking
export interface User {
  username: string;
  email?: string;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get the current user information
 * @returns {User|null} User object or null if not logged in
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const username = localStorage.getItem('username');
  if (!username) return null;
  
  const email = localStorage.getItem('email');
  
  return {
    username,
    email: email || undefined
  };
};

/**
 * Get the authorization header for API requests
 * @returns {Object} Header object with Authorization property
 */
export const getAuthHeader = (): { Authorization: string } | {} => {
  if (typeof window === 'undefined') return {};
  
  const token = localStorage.getItem('token');
  if (!token) return {};
  
  return { Authorization: `Bearer ${token}` };
};

/**
 * Log out the current user
 */
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
};
