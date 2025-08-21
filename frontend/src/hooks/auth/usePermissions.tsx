import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { Permission, Role } from '@/types';

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

  // Municipality-specific permission checks
  const canCreateMunicipality = hasPermission('create_municipality');
  const canGetMunicipality = hasPermission('get_municipality');
  const canEditMunicipality = hasPermission('edit_municipality');
  const canDeleteMunicipality = hasPermission('delete_municipality');

  // Parish-specific permission checks
  const canCreateParish = hasPermission('create_parish');
  const canGetParish = hasPermission('get_parish');
  const canEditParish = hasPermission('edit_parish');
  const canDeleteParish = hasPermission('delete_parish');

  // Organism-specific permission checks
  const canCreateOrganism = hasPermission('create_organism');
  const canGetOrganism = hasPermission('get_organism');
  const canEditOrganism = hasPermission('edit_organism');
  const canDeleteOrganism = hasPermission('delete_organism');

  // Responsible-specific permission checks
  const canCreateResponsible = hasPermission('create_responsible');
  const canGetResponsible = hasPermission('get_responsible');
  const canEditResponsible = hasPermission('edit_responsible');
  const canDeleteResponsible = hasPermission('delete_responsible');

  // Quadrant-specific permission checks
  const canCreateQuadrant = hasPermission('create_quadrant');
  const canGetQuadrant = hasPermission('get_quadrant');
  const canEditQuadrant = hasPermission('edit_quadrant');
  const canDeleteQuadrant = hasPermission('delete_quadrant');

  // CommunalCircuit-specific permission checks
  const canCreateCommunalCircuit = hasPermission('create_communalcircuit');
  const canGetCommunalCircuit = hasPermission('get_communalcircuit');
  const canEditCommunalCircuit = hasPermission('edit_communalcircuit');
  const canDeleteCommunalCircuit = hasPermission('delete_communalcircuit');

  // PointOfInterest-specific permission checks
  const canCreatePointOfInterest = hasPermission('create_pointofinterest');
  const canGetPointOfInterest = hasPermission('get_pointofinterest');
  const canEditPointOfInterest = hasPermission('edit_pointofinterest');
  const canDeletePointOfInterest = hasPermission('delete_pointofinterest');

  // Spatial-related permission checks
  const canCreateAnySpatial = canCreateCommunalCircuit || canCreateQuadrant || canCreatePointOfInterest;
  const canGetAnySpatial = canGetCommunalCircuit || canGetQuadrant || canGetPointOfInterest;
  const canEditAnySpatial = canEditCommunalCircuit || canEditQuadrant || canEditPointOfInterest;
  const canDeleteAnySpatial = canDeleteCommunalCircuit || canDeleteQuadrant || canDeletePointOfInterest;
  
  // Composite permission checks
  const canManageUsers = canCreateUser || canGetUser || canEditUser || canDeleteUser;
  const canManageRoles = canCreateRole || canGetRole || canEditRole || canDeleteRole;
  const canManageStates = canCreateState || canGetState || canEditState || canDeleteState;
  const canManageMunicipalities = canCreateMunicipality || canGetMunicipality || canEditMunicipality || canDeleteMunicipality;
  const canManageParishes = canCreateParish || canGetParish || canEditParish || canDeleteParish;
  const canManageOrganisms = canCreateOrganism || canGetOrganism || canEditOrganism || canDeleteOrganism;
  const canManageResponsibles = canCreateResponsible || canGetResponsible || canEditResponsible || canDeleteResponsible;
  const canManageQuadrants = canCreateQuadrant || canGetQuadrant || canEditQuadrant || canDeleteQuadrant;
  const canManageCommunalCircuits = canCreateCommunalCircuit || canGetCommunalCircuit || canEditCommunalCircuit || canDeleteCommunalCircuit;
  const canManagePointOfInterests = canCreatePointOfInterest || canGetPointOfInterest || canEditPointOfInterest || canDeletePointOfInterest;
  const canManageAnySpatial = canGetAnySpatial || canEditAnySpatial || canDeleteAnySpatial || canCreateAnySpatial;

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
    // Municipality permissions
    canCreateMunicipality,
    canGetMunicipality,
    canEditMunicipality,
    canDeleteMunicipality,
    canManageMunicipalities,
    // Parish permissions
    canCreateParish,
    canGetParish,
    canEditParish,
    canDeleteParish,
    canManageParishes,
    // Organism permissions
    canCreateOrganism,
    canGetOrganism,
    canEditOrganism,
    canDeleteOrganism,
    canManageOrganisms,
    // Responsible permissions
    canCreateResponsible,
    canGetResponsible,
    canEditResponsible,
    canDeleteResponsible,
    canManageResponsibles,
    // Quadrant permissions
    canCreateQuadrant,
    canGetQuadrant,
    canEditQuadrant,
    canDeleteQuadrant,
    canManageQuadrants,
    // CommunalCircuit permissions
    canCreateCommunalCircuit,
    canGetCommunalCircuit,
    canEditCommunalCircuit,
    canDeleteCommunalCircuit,
    canManageCommunalCircuits,
    // PointOfInterest permissions
    canCreatePointOfInterest,
    canGetPointOfInterest,
    canEditPointOfInterest,
    canDeletePointOfInterest,
    canManagePointOfInterests,
    // Spatial permissions
    canGetAnySpatial,
    canEditAnySpatial,
    canDeleteAnySpatial,
    canCreateAnySpatial,
    canManageAnySpatial,
    // Permission permissions
    canGetPermission,
  };
};
