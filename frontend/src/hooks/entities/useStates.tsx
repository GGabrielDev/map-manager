import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import type { PaginatedStatesResponse } from '@/services/api/states';
import { statesApi } from '@/services/api/states';
import type { RootState } from '@/store';
import type { State, StateFilterOptions } from '@/types/entities';

export const useStateManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch states with useCallback to prevent unnecessary re-renders
  const fetchStates = useCallback(async (currentPage = 1, filters?: Partial<StateFilterOptions>) => {
    if (!token) return;

    setLoading(true);
    setError('');
    
    const options: StateFilterOptions = {
      page: currentPage,
      pageSize: 10,
      ...filters
    };
    
    try {
      const response: PaginatedStatesResponse = await statesApi.getStates(options, token);
      
      setStates(response.data || []);
      setTotalPages(response.totalPages || 1);
      setPage(response.currentPage);
      
      // If current page is greater than total pages, reset to page 1
      if (currentPage > response.totalPages && response.totalPages > 0) {
        setPage(1);
      }
    } catch (err) {
      console.error('Error fetching states:', err);
      setError('Failed to fetch states');
      setStates([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch individual state
  const fetchStateById = useCallback(async (stateId: number): Promise<State | null> => {
    if (!token) return null;

    try {
      const state = await statesApi.getStateById(stateId, token);
      return state;
    } catch (err) {
      console.error('Error fetching state:', err);
      setError('Failed to fetch state');
      return null;
    }
  }, [token]);

  // Create state
  const createState = useCallback(async (name: string): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    setError('');

    try {
      await statesApi.createState({ name }, token);
      return true;
    } catch (err) {
      console.error('Error creating state:', err);
      setError('Failed to create state');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Update state
  const updateState = useCallback(async (stateId: number, name: string): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    setError('');

    try {
      await statesApi.updateState(stateId, { name }, token);
      return true;
    } catch (err) {
      console.error('Error updating state:', err);
      setError('Failed to update state');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Delete state
  const deleteState = useCallback(async (stateId: number): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    setError('');

    try {
      await statesApi.deleteState(stateId, token);
      return true;
    } catch (err) {
      console.error('Error deleting state:', err);
      setError('Failed to delete state');
      return false;
    } finally {
      setLoading(false);
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
