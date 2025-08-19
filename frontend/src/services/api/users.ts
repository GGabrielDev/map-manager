import type { User, UserFilterOptions } from '@/types/auth';

export interface PaginatedUsersResponse {
  data: User[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const usersApi = {
  // Get all users with pagination and filtering
  getUsers: async (
    options: UserFilterOptions,
    token: string
  ): Promise<PaginatedUsersResponse> => {
    const params = new URLSearchParams();
    params.append('page', options.page.toString());
    params.append('pageSize', options.pageSize.toString());
    
    if (options.username) params.append('username', options.username);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    return response.json();
  },

  // Get user by ID
  getUserById: async (id: number, token: string): Promise<User> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user');
    }

    return response.json();
  },

  // Create new user
  createUser: async (
    userData: { username: string; password: string; roleIds: number[] },
    token: string
  ): Promise<User> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }

    return response.json();
  },

  // Update user
  updateUser: async (
    id: number,
    userData: { username?: string; password?: string; roleIds?: number[] },
    token: string
  ): Promise<User> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }

    return response.json();
  },

  // Delete user
  deleteUser: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }
  },
};
