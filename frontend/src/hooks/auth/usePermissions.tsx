import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { Permission, Role } from '@/types'

export const usePermissions = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const hasPermission = (permissionName: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.some((role: Role) =>
      role.permissions.some((permission: Permission) => permission.name === permissionName)
    );
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionNames.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    return permissionNames.every(permission => hasPermission(permission));
  };

  // User-specific permission checks
  const canCreateUser = hasPermission('create_user');
  const canGetUser = hasPermission('get_user');
  const canEditUser = hasPermission('edit_user');
  const canDeleteUser = hasPermission('delete_user');

  // Role-specific permission checks
  const canCreateRole = hasPermission('create_role');
  const canGetRole = hasPermission('get_role');
  const canEditRole = hasPermission('edit_role');
  const canDeleteRole = hasPermission('delete_role');

  // Permission-specific permission checks
  const canGetPermission = hasPermission('get_permission');

  // State-specific permission checks
  const canCreateState = hasPermission('create_state');
  const canGetState = hasPermission('get_state');
  const canEditState = hasPermission('edit_state');
  const canDeleteState = hasPermission('delete_state');

  // Composite permission checks
  const canManageUsers = canCreateUser || canGetUser || canEditUser || canDeleteUser;
  const canManageRoles = canCreateRole || canGetRole || canEditRole || canDeleteRole;
  const canManageStates = canCreateState || canGetState || canEditState || canDeleteState;

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    // User permissions
    canCreateUser,
    canGetUser,
    canEditUser,
    canDeleteUser,
    canManageUsers,
    // Role permissions
    canCreateRole,
    canGetRole,
    canEditRole,
    canDeleteRole,
    canManageRoles,
    // State permissions
    canCreateState,
    canGetState,
    canEditState,
    canDeleteState,
    canManageStates,
    // Permission permissions
    canGetPermission,
  };
};
