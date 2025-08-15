import type { Permission } from '@/types/auth';

export interface PaginatedPermissionsResponse {
  data: Permission[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface PermissionFilterOptions {
  page: number;
  pageSize: number;
  name?: string;
  sortBy?: 'name' | 'description';
  sortOrder?: 'ASC' | 'DESC';
}

export const permissionsApi = {
  // Get all permissions with pagination and filtering
  getPermissions: async (
    options: PermissionFilterOptions,
    token: string
  ): Promise<PaginatedPermissionsResponse> => {
    const params = new URLSearchParams();
    params.append('page', options.page.toString());
    params.append('pageSize', options.pageSize.toString());
    
    if (options.name) params.append('name', options.name);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/permissions?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch permissions');
    }

    return response.json();
  },

  // Get permission by ID
  getPermissionById: async (id: number, token: string): Promise<Permission> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/permissions/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch permission');
    }

    return response.json();
  },

  // Get all permissions (without pagination) - useful for dropdowns
  getAllPermissions: async (token: string): Promise<Permission[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/permissions?pageSize=1000`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch permissions');
    }

    const result = await response.json();
    return result.data || [];
  },
};
