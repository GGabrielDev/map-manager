import type { State, StateFilterOptions } from '@/types/entities';

export interface PaginatedStatesResponse {
  data: State[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const statesApi = {
  // Get all states with pagination and filtering
  getStates: async (
    options: StateFilterOptions,
    token: string
  ): Promise<PaginatedStatesResponse> => {
    const params = new URLSearchParams();
    params.append('page', options.page.toString());
    params.append('pageSize', options.pageSize.toString());
    
    if (options.name) params.append('name', options.name);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/states?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch states');
    }

    return response.json();
  },

  // Get state by ID
  getStateById: async (id: number, token: string): Promise<State> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/states/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch state');
    }

    return response.json();
  },

  // Create new state
  createState: async (
    stateData: { name: string },
    token: string
  ): Promise<State> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/states`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create state');
    }

    return response.json();
  },

  // Update state
  updateState: async (
    id: number,
    stateData: { name: string },
    token: string
  ): Promise<State> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/states/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update state');
    }

    return response.json();
  },

  // Delete state
  deleteState: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/states/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete state');
    }
  },
};
