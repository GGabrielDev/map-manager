import { useCallback,useState } from 'react';
import { useSelector } from 'react-redux';

import type { PaginatedMunicipalitiesResponse } from '@/services/api/municipalities';
import { municipalitiesApi } from '@/services/api/municipalities';
import type { RootState } from '@/store';
import type { Municipality, MunicipalityFilterOptions } from '@/types/entities';

export const useMunicipalityManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMunicipalities = useCallback(async (options: MunicipalityFilterOptions) => {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const response: PaginatedMunicipalitiesResponse = await municipalitiesApi.getMunicipalities(options, token);
      setMunicipalities(response.data);
      setTotalPages(response.totalPages);
      setPage(response.currentPage);
    } catch (err) {
      console.error('Error fetching municipalities:', err);
      setError('Failed to fetch municipalities');
      setMunicipalities([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchMunicipalityById = useCallback(async (id: number): Promise<Municipality | null> => {
    if (!token) return null;

    try {
      const municipality = await municipalitiesApi.getMunicipalityById(id, token);
      return municipality;
    } catch (err) {
      console.error('Error fetching municipality:', err);
      setError('Failed to fetch municipality');
      return null;
    }
  }, [token]);

  const createMunicipality = useCallback(async (municipalityData: { name: string; stateId: number }): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    setError('');

    try {
      await municipalitiesApi.createMunicipality(municipalityData, token);
      return true;
    } catch (err) {
      console.error('Error creating municipality:', err);
      setError('Failed to create municipality');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateMunicipality = useCallback(async (id: number, municipalityData: { name: string }): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    setError('');

    try {
      await municipalitiesApi.updateMunicipality(id, municipalityData, token);
      return true;
    } catch (err) {
      console.error('Error updating municipality:', err);
      setError('Failed to update municipality');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteMunicipality = useCallback(async (id: number): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    setError('');

    try {
      await municipalitiesApi.deleteMunicipality(id, token);
      return true;
    } catch (err) {
      console.error('Error deleting municipality:', err);
      setError('Failed to delete municipality');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    municipalities,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchMunicipalities,
    fetchMunicipalityById,
    createMunicipality,
    updateMunicipality,
    deleteMunicipality,
  };
};
