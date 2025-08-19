import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { organismsApi } from '@/services/api'
import type { RootState } from '@/store';
import type { Organism, OrganismFilterOptions } from '@/types/entities';

export const useOrganismManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [organisms, setOrganisms] = useState<Organism[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch organisms with useCallback to prevent unnecessary re-renders
  const fetchOrganisms = useCallback(async (options: Partial<OrganismFilterOptions> = {}) => {
    if (!token) return;

    setLoading(true);
    setError('');
    
    const filterOptions: OrganismFilterOptions = {
      page: options.page || page,
      pageSize: options.pageSize || 10,
      name: options.name,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
    };
    
    try {
      const response = await organismsApi.getOrganisms(filterOptions, token);
      
      setOrganisms(response.data || []);
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

  // Fetch individual organism
  const fetchOrganismById = useCallback(async (organismId: number): Promise<Organism | null> => {
    if (!token) return null;

    try {
      const organism = await organismsApi.getOrganismById(organismId, token);
      return organism;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      return null;
    }
  }, [token]);

  // Delete organism
  const deleteOrganism = useCallback(async (organismId: number): Promise<boolean> => {
    if (!token) return false;

    try {
      await organismsApi.deleteOrganism(organismId, token);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      return false;
    }
  }, [token]);

  return {
    organisms,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchOrganisms,
    fetchOrganismById,
    deleteOrganism,
  };
};
