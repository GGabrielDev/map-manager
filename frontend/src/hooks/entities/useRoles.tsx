import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { rolesApi } from '@/services/api';
import type { RootState } from '@/store';
import type { Role } from '@/types/auth';

export const useRoleManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch roles with useCallback to prevent unnecessary re-renders
  const fetchRoles = useCallback(async (currentPage = 1) => {
    if (!token) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await rolesApi.getRoles({
        page: currentPage,
        pageSize: 10,
      }, token);
      
      setRoles(response.data || []);
      setTotalPages(response.totalPages || 1);
      setPage(response.currentPage || 1);
      
      // If current page is greater than total pages, reset to page 1
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
  }, [token]);

  // Fetch individual role with permissions
  const fetchRoleById = useCallback(async (roleId: number): Promise<Role | null> => {
    if (!token) return null;

    try {
      const role = await rolesApi.getRoleById(roleId, token);
      return role;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      return null;
    }
  }, [token]);

  // Delete role
  const deleteRole = useCallback(async (roleId: number): Promise<boolean> => {
    if (!token) return false;

    try {
      await rolesApi.deleteRole(roleId, token);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
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
