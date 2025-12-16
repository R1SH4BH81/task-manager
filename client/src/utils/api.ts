/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://task-manager2-y29t.onrender.com';

export const api = {
  // Auth endpoints
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  profile: `${API_BASE_URL}/api/auth/profile`,
  
  // Task endpoints
  tasks: `${API_BASE_URL}/api/tasks`,
  task: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
  
  // Helper function to make authenticated requests
  authenticatedRequest: (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    
    return fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });
  },
};