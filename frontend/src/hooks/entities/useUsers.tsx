import { useCallback,useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { PaginatedResponse, User, UserFilterOptions } from '@/types';

export const useUserManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users with useCallback to prevent unnecessary re-renders
  const fetchUsers = useCallback(async (options: Partial<UserFilterOptions> = {}) => {
    setLoading(true);
    setError('');
    
    const params = new URLSearchParams({
      page: (options.page || page).toString(),
      pageSize: (options.pageSize || 10).toString(),
    });

    if (options.username) {
      params.append('username', options.username);
    }
    if (options.sortBy) {
      params.append('sortBy', options.sortBy);
    }
    if (options.sortOrder) {
      params.append('sortOrder', options.sortOrder);
    }
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }
      const data: PaginatedResponse<User> = await response.json();
      
      // Backend returns { data, total, totalPages, currentPage }
      setUsers(data.data || []);
      setTotalPages(data.totalPages || 1);
      
      // If current page is greater than total pages, reset to page 1
      const currentPage = options.page || page;
      if (currentPage > data.totalPages && data.totalPages > 0) {
        setPage(1);
      }
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  // Fetch individual user with roles
  const fetchUserById = useCallback(async (userId: number): Promise<User | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user details');
      }
      
      return data;
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
      return null;
    }
  }, [token]);

  // Delete user
  const deleteUser = useCallback(async (userId: number): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
      return false;
    }
  }, [token]);

  return {
    users,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchUsers,
    fetchUserById,
    deleteUser,
  };
};
