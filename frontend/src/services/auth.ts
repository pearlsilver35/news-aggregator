import { User } from '../types';

const API_URL = 'http://localhost:8000/api';

// Helper to get headers with auth token
const getHeaders = (includeAuth: boolean = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = token;
    }
  }
  return headers;
};

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    if (!result.access_token) {
      throw new Error('No access token received from server');
    }

    localStorage.setItem('token', `${result.token_type} ${result.access_token}`);
    return result;
  },

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    if (!result.access_token) {
      throw new Error('No access token received from server');
    }

    localStorage.setItem('token', `${result.token_type} ${result.access_token}`);
    return result;
  },

  async logout() {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } finally {
      localStorage.removeItem('token');
    }
  },

  async getCurrentUser(): Promise<User> {
    const headers = getHeaders(true);

    const response = await fetch(`${API_URL}/user`, {
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error('Failed to get user');
    }

    return response.json();
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token;
  }
}; 