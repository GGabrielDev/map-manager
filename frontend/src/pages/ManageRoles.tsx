import { 
  Alert, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Container, 
  Pagination, 
  Typography} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import RoleFormDialog from '@/components/role/RoleFormDialog';
import RolesTable from '@/components/role/RolesTable';
import { usePermissions, useRoleManagement } from '@/hooks';
import type { Role } from '@/types'

const ManageRoles: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  const {
    canCreateRole,
    canEditRole,
    canDeleteRole,
    canManageRoles,
    canGetPermission
  } = usePermissions();

  const {
    roles,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchRoles,
    fetchRoleById,
    deleteRole,
  } = useRoleManagement();

  // If user doesn't have basic role viewing permission, redirect
  useEffect(() => {
    if (!canManageRoles) {
      navigate('/dashboard');
      return;
    }
  }, [canManageRoles, navigate]);

  useEffect(() => {
    if (canManageRoles) {
      fetchRoles(page);
    }
  }, [page, fetchRoles, canManageRoles]);

  const handleDelete = async (roleId: number) => {
    if (!canDeleteRole) return;
    
    const success = await deleteRole(roleId);
    if (success) {
      // Refresh the list
      fetchRoles(page);
    }
  };

  const handleEdit = async (role: Role) => {
    if (!canEditRole) return;
    
    const fullRole = await fetchRoleById(role.id);
    if (fullRole) {
      setEditingRole(fullRole);
      setShowForm(true);
    }
  };

  const handleCreate = () => {
    if (!canCreateRole) return;
    setEditingRole(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingRole(null);
    fetchRoles(page);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRole(null);
  };

  // Don't render anything if user doesn't have basic permissions
  if (!canManageRoles) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('roles:page.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('roles:page.subtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            {t('backToDashboard')}
          </Button>
          {/* Only show Create button if user has create permission */}
          {canCreateRole && (
            <Button
              variant="contained"
              onClick={handleCreate}
            >
              {t('roles:page.createNewRole')}
            </Button>
          )}
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Roles Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : roles.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('roles:page.noRolesFound')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {canCreateRole 
                ? t('roles:page.getStarted')
                : t('roles:page.noRolesConfigured')
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <RolesTable
          roles={roles}
          canEditRole={canEditRole}
          canDeleteRole={canDeleteRole}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}

      {/* Role Form Dialog */}
      {showForm && (canCreateRole || canEditRole) && (
        <RoleFormDialog
          open={showForm}
          role={editingRole}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          canEdit={canEditRole}
          canCreate={canCreateRole}
          canGetPermission={canGetPermission}
        />
      )}
    </Container>
  );
};

export default ManageRoles;
