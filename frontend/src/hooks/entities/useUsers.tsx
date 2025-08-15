import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { usersApi } from '@/services/api';
import type { RootState } from '@/store';
import type { User, UserFilterOptions } from '@/types/auth';

export const useUserManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users with useCallback to prevent unnecessary re-renders
  const fetchUsers = useCallback(async (options: Partial<UserFilterOptions> = {}) => {
    if (!token) return;

    setLoading(true);
    setError('');
    
    const filterOptions: UserFilterOptions = {
      page: options.page || page,
      pageSize: options.pageSize || 10,
      username: options.username,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
    };
    
    try {
      const response = await usersApi.getUsers(filterOptions, token);
      
      setUsers(response.data || []);
      setTotalPages(response.totalPages || 1);
      setPage(response.currentPage || 1);
      
      // If current page is greater than total pages, reset to page 1
      const currentPage = options.page || page;
      if (currentPage > response.totalPages && response.totalPages > 0) {
        setPage(1);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  // Fetch individual user with roles
  const fetchUserById = useCallback(async (userId: number): Promise<User | null> => {
    if (!token) return null;

    try {
      const user = await usersApi.getUserById(userId, token);
      return user;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      return null;
    }
  }, [token]);

  // Delete user
  const deleteUser = useCallback(async (userId: number): Promise<boolean> => {
    if (!token) return false;

    try {
      await usersApi.deleteUser(userId, token);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
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
