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

  // Department-specific permission checks
  const canCreateDepartment = hasPermission('create_department');
  const canGetDepartment = hasPermission('get_department');
  const canEditDepartment = hasPermission('edit_department');
  const canDeleteDepartment = hasPermission('delete_department');

  // Category-specific permission checks
  const canCreateCategory = hasPermission('create_category');
  const canGetCategory = hasPermission('get_category');
  const canEditCategory = hasPermission('edit_category');
  const canDeleteCategory = hasPermission('delete_category');

  // Item-specific permission checks
  const canCreateItem = hasPermission('create_item');
  const canGetItem = hasPermission('get_item');
  const canEditItem = hasPermission('edit_item');
  const canDeleteItem = hasPermission('delete_item');

  // Permission-specific permission checks
  const canGetPermission = hasPermission('get_permission');

  // Composite permission checks
  const canManageUsers = canCreateUser || canGetUser || canEditUser || canDeleteUser;
  const canManageRoles = canCreateRole || canGetRole || canEditRole || canDeleteRole;
  const canManageDepartments = canCreateDepartment || canGetDepartment || canEditDepartment || canDeleteDepartment;
  const canManageCategories = canCreateCategory || canGetCategory || canEditCategory || canDeleteCategory;
  const canManageItems = canCreateItem || canGetItem || canEditItem || canDeleteItem;

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
    // Department permissions
    canCreateDepartment,
    canGetDepartment,
    canEditDepartment,
    canDeleteDepartment,
    canManageDepartments,
    // Category permissions
    canCreateCategory,
    canGetCategory,
    canEditCategory,
    canDeleteCategory,
    canManageCategories,
    // Item permissions
    canCreateItem,
    canGetItem,
    canEditItem,
    canDeleteItem,
    canManageItems,
    // Permission permissions
    canGetPermission,
  };
};
