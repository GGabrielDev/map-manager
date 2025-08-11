import type { Municipality, MunicipalityFilterOptions } from '@/types/entities';

export interface PaginatedMunicipalitiesResponse {
  data: Municipality[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const municipalitiesApi = {
  // Get all municipalities with pagination and filtering
  getMunicipalities: async (
    options: MunicipalityFilterOptions,
    token: string
  ): Promise<PaginatedMunicipalitiesResponse> => {
    const params = new URLSearchParams();
    params.append('page', options.page.toString());
    params.append('pageSize', options.pageSize.toString());
    
    if (options.name) params.append('name', options.name);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/municipalities?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch municipalities');
    }

    return response.json();
  },

  // Get municipality by ID
  getMunicipalityById: async (id: number, token: string): Promise<Municipality> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/municipalities/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch municipality');
    }

    return response.json();
  },

  // Create new municipality
  createMunicipality: async (
    municipalityData: { name: string; stateId: number },
    token: string
  ): Promise<Municipality> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/municipalities`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(municipalityData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create municipality');
    }

    return response.json();
  },

  // Update municipality
  updateMunicipality: async (
    id: number,
    municipalityData: { name: string },
    token: string
  ): Promise<Municipality> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/municipalities/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(municipalityData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update municipality');
    }

    return response.json();
  },

  // Delete municipality
  deleteMunicipality: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/municipalities/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete municipality');
    }
  },
};
