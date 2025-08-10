import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { PaginatedResponse, State, StateFilterOptions } from '@/types';

export const useStateManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch states with useCallback to prevent unnecessary re-renders
  const fetchStates = useCallback(async (currentPage = 1, filters?: Partial<StateFilterOptions>) => {
    setLoading(true);
    setError('');
    
    const params = new URLSearchParams({
      page: currentPage.toString(),
      pageSize: '10',
    });

    if (filters?.name) {
      params.append('name', filters.name);
    }
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (filters?.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/states?${params.toString()}`,
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
      const data: PaginatedResponse<State> = await response.json();
      
      // Backend returns { data, total, totalPages, currentPage }
      setStates(data.data || []);
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

  // Fetch individual state
  const fetchStateById = useCallback(async (stateId: number): Promise<State | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/states/${stateId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch state details');
      }
      
      return data;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return null;
    }
  }, [token]);

  // Create state
  const createState = useCallback(async (name: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/states`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create state');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  // Update state
  const updateState = useCallback(async (stateId: number, name: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/states/${stateId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update state');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  // Delete state
  const deleteState = useCallback(async (stateId: number): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/states/${stateId}`,
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
        throw new Error(data.error || 'Failed to delete state');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  return {
    states,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchStates,
    fetchStateById,
    createState,
    updateState,
    deleteState,
  };
};
