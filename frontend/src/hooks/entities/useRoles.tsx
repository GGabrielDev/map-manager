import { useCallback,useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { Role } from '@/types'

export const useRoleManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch roles with useCallback to prevent unnecessary re-renders
  const fetchRoles = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/roles?page=${currentPage}&pageSize=10`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch roles');
      }
      
      // Backend returns { data, total, totalPages, currentPage }
      setRoles(data.data || []);
      setTotalPages(data.totalPages || 1);
      
      // If current page is greater than total pages, reset to page 1
      if (currentPage > data.totalPages && data.totalPages > 0) {
        setPage(1);
      }
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch individual role with permissions
  const fetchRoleById = useCallback(async (roleId: number): Promise<Role | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/roles/${roleId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch role details');
      }
      
      return data;
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
      return null;
    }
  }, [token]);

  // Delete role
  const deleteRole = useCallback(async (roleId: number): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/roles/${roleId}`,
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
        throw new Error(data.error || 'Failed to delete role');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
      return false;
    }
  }, [token]);

  return {
    roles,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchRoles,
    fetchRoleById,
    deleteRole,
  };
};
