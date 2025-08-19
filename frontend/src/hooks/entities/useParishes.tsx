import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import type { PaginatedParishesResponse } from '@/services/api/parishes';
import { parishesApi } from '@/services/api/parishes';
import type { RootState } from '@/store';
import type { Parish, ParishFilterOptions } from '@/types/entities';

export const useParishManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchParishes = useCallback(async (options: ParishFilterOptions) => {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const response: PaginatedParishesResponse = await parishesApi.getParishes(options, token);
      setParishes(response.data);
      setTotalPages(response.totalPages);
      setPage(response.currentPage);
    } catch (err) {
      console.error('Error fetching parishes:', err);
      setError('Failed to fetch parishes');
      setParishes([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchParishById = useCallback(async (id: number): Promise<Parish | null> => {
    if (!token) return null;

    try {
      const parish = await parishesApi.getParishById(id, token);
      return parish;
    } catch (err) {
      console.error('Error fetching parish:', err);
      setError('Failed to fetch parish');
      return null;
    }
  }, [token]);

  const createParish = useCallback(async (parishData: { name: string; municipalityId: number }): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    setError('');

    try {
      await parishesApi.createParish(parishData, token);
      return true;
    } catch (err) {
      console.error('Error creating parish:', err);
      setError('Failed to create parish');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateParish = useCallback(async (id: number, parishData: { name: string }): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    setError('');

    try {
      await parishesApi.updateParish(id, parishData, token);
      return true;
    } catch (err) {
      console.error('Error updating parish:', err);
      setError('Failed to update parish');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteParish = useCallback(async (id: number): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    setError('');

    try {
      await parishesApi.deleteParish(id, token);
      return true;
    } catch (err) {
      console.error('Error deleting parish:', err);
      setError('Failed to delete parish');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    parishes,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchParishes,
    fetchParishById,
    createParish,
    updateParish,
    deleteParish,
  };
};
