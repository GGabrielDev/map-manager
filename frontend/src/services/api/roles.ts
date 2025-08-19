import type { Role } from '@/types/auth';

export interface PaginatedRolesResponse {
  data: Role[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface RoleFilterOptions {
  page: number;
  pageSize: number;
  name?: string;
  sortBy?: 'name' | 'creationDate' | 'updatedOn';
  sortOrder?: 'ASC' | 'DESC';
}

export const rolesApi = {
  // Get all roles with pagination and filtering
  getRoles: async (
    options: RoleFilterOptions,
    token: string
  ): Promise<PaginatedRolesResponse> => {
    const params = new URLSearchParams();
    params.append('page', options.page.toString());
    params.append('pageSize', options.pageSize.toString());
    
    if (options.name) params.append('name', options.name);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/roles?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch roles');
    }

    return response.json();
  },

  // Get role by ID
  getRoleById: async (id: number, token: string): Promise<Role> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/roles/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch role');
    }

    return response.json();
  },

  // Create new role
  createRole: async (
    roleData: { name: string; description?: string; permissionIds: number[] },
    token: string
  ): Promise<Role> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create role');
    }

    return response.json();
  },

  // Update role
  updateRole: async (
    id: number,
    roleData: { name?: string; description?: string; permissionIds?: number[] },
    token: string
  ): Promise<Role> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update role');
    }

    return response.json();
  },

  // Delete role
  deleteRole: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete role');
    }
  },
};
