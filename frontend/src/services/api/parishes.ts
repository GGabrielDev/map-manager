import type { Parish, ParishFilterOptions } from '@/types/entities';

export interface PaginatedParishesResponse {
  data: Parish[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const parishesApi = {
  // Get all parishes with pagination and filtering
  getParishes: async (
    options: ParishFilterOptions,
    token: string
  ): Promise<PaginatedParishesResponse> => {
    const params = new URLSearchParams();
    params.append('page', options.page.toString());
    params.append('pageSize', options.pageSize.toString());
    
    if (options.name) params.append('name', options.name);
    if (options.municipalityId) params.append('municipalityId', options.municipalityId.toString());
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/parishes?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch parishes');
    }

    return response.json();
  },

  // Get parish by ID
  getParishById: async (id: number, token: string): Promise<Parish> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/parishes/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch parish');
    }

    return response.json();
  },

  // Create new parish
  createParish: async (
    parishData: { name: string; municipalityId: number },
    token: string
  ): Promise<Parish> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/parishes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parishData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create parish');
    }

    return response.json();
  },

  // Update parish
  updateParish: async (
    id: number,
    parishData: { name: string },
    token: string
  ): Promise<Parish> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/parishes/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parishData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update parish');
    }

    return response.json();
  },

  // Delete parish
  deleteParish: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/parishes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete parish');
    }
  },
};
