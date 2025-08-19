import type { Organism, OrganismFilterOptions } from '@/types/entities';

export interface PaginatedOrganismsResponse {
  data: Organism[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const organismsApi = {
  // Get all organisms with pagination and filtering
  getOrganisms: async (
    options: OrganismFilterOptions,
    token: string
  ): Promise<PaginatedOrganismsResponse> => {
    const params = new URLSearchParams();
    params.append('page', options.page.toString());
    params.append('pageSize', options.pageSize.toString());
    
    if (options.name) params.append('name', options.name);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/organisms?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch organisms');
    }

    return response.json();
  },

  // Get organism by ID
  getOrganismById: async (id: number, token: string): Promise<Organism> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/organisms/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch organism');
    }

    return response.json();
  },

  // Create new organism with icon upload
  createOrganism: async (
    organismData: { name: string; icono: File },
    token: string
  ): Promise<Organism> => {
    const formData = new FormData();
    formData.append('name', organismData.name);
    formData.append('icono', organismData.icono);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/organisms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create organism');
    }

    return response.json();
  },

  // Update organism
  updateOrganism: async (
    id: number,
    organismData: { name?: string; icono?: File },
    token: string
  ): Promise<Organism> => {
    const formData = new FormData();
    
    if (organismData.name) {
      formData.append('name', organismData.name);
    }
    if (organismData.icono) {
      formData.append('icono', organismData.icono);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/organisms/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update organism');
    }

    return response.json();
  },

  // Delete organism
  deleteOrganism: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/organisms/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete organism');
    }
  },
};
