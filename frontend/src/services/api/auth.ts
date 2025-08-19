import type { LoginCredentials, User } from '../../types/auth';

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ValidateResponse {
  valid: boolean;
  user?: User;
}

export const authApi = {
  // User login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to login');
    }

    return response.json();
  },

  // Validate JWT token
  validate: async (token: string): Promise<ValidateResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to validate token');
    }

    return response.json();
  },

  // Get current user information
  me: async (token: string): Promise<User> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get user information');
    }

    return response.json();
  },
};
