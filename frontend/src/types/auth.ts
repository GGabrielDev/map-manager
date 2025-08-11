// Authentication-related types

export interface User {
  id: number;
  username: string;
  roles: Role[] | [];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[] | [];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Form data types
export interface RoleFormData {
  name: string;
  description: string;
  selectedPermissions: number[];
}

export interface UserFormData {
  username: string;
  password: string;
  selectedRoles: number[];
}

// Component Props types
export interface RoleFormDialogProps {
  open: boolean;
  role: Role | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
  canGetPermission: boolean;
}

export interface RolesTableProps {
  roles: Role[];
  canEditRole: boolean;
  canDeleteRole: boolean;
  onEdit: (role: Role) => void;
  onDelete: (roleId: number) => void;
}

export interface UserFormDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
  canGetRole: boolean;
}

export interface UsersTableProps {
  users: User[];
  canEditUser: boolean;
  canDeleteUser: boolean;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

// Filter options for API
export interface UserFilterOptions {
  page: number;
  pageSize: number;
  username?: string;
  sortBy?: 'username' | 'creationDate' | 'updatedOn';
  sortOrder?: 'ASC' | 'DESC';
}
