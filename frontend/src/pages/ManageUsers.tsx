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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import UserFormDialog from '@/components/user/UserFormDialog';
import UsersTable from '@/components/user/UsersTable';
import { usePermissions, useUserManagement } from '@/hooks';
import type { User } from '@/types';

const ManageUsers: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const {
    canCreateUser,
    canEditUser,
    canDeleteUser,
    canManageUsers,
    canGetRole
  } = usePermissions();

  const {
    users,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchUsers,
    fetchUserById,
    deleteUser,
  } = useUserManagement();

  // If user doesn't have basic user viewing permission, redirect
  useEffect(() => {
    if (!canManageUsers) {
      navigate('/dashboard');
      return;
    }
  }, [canManageUsers, navigate]);

  useEffect(() => {
    if (canManageUsers) {
      fetchUsers({ page });
    }
  }, [page, fetchUsers, canManageUsers]);

  const handleDelete = async (userId: number) => {
    if (!canDeleteUser) return;
    
    const success = await deleteUser(userId);
    if (success) {
      // Refresh the list
      fetchUsers({ page });
    }
  };

  const handleEdit = async (user: User) => {
    if (!canEditUser) return;
    
    const fullUser = await fetchUserById(user.id);
    if (fullUser) {
      setEditingUser(fullUser);
      setShowForm(true);
    }
  };

  const handleCreate = () => {
    if (!canCreateUser) return;
    setEditingUser(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingUser(null);
    fetchUsers({ page });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  // Don't render anything if user doesn't have basic permissions
  if (!canManageUsers) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Manage Users
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create and manage user accounts
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          {/* Only show Create button if user has create permission */}
          {canCreateUser && (
            <Button
              variant="contained"
              onClick={handleCreate}
            >
              Create New User
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

      {/* Users Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Users Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {canCreateUser 
                ? 'Get started by creating your first user.' 
                : 'No users are currently configured.'
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <UsersTable
          users={users}
          canEditUser={canEditUser}
          canDeleteUser={canDeleteUser}
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

      {/* User Form Dialog */}
      {showForm && (canCreateUser || canEditUser) && (
        <UserFormDialog
          open={showForm}
          user={editingUser}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          canEdit={canEditUser}
          canCreate={canCreateUser}
          canGetRole={canGetRole}
        />
      )}
    </Container>
  );
};

export default ManageUsers;
