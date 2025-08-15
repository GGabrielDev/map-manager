import { 
  Alert, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Container, 
  Pagination, 
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ParishFormDialog from '@/components/forms/ParishForm';
import ParishesTable from '@/components/tables/ParishesTable';
import { useParishManagement,usePermissions } from '@/hooks';
import type { Parish } from '@/types/entities';

const ManageParishes: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingParish, setEditingParish] = useState<Parish | null>(null);
  
  const {
    canCreateParish,
    canEditParish,
    canDeleteParish,
    canManageParishes,
    canGetMunicipality
  } = usePermissions();

  const {
    parishes,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchParishes,
    fetchParishById,
    deleteParish,
  } = useParishManagement();

  // If user doesn't have basic parish viewing permission, redirect
  useEffect(() => {
    if (!canManageParishes) {
      navigate('/dashboard');
      return;
    }
  }, [canManageParishes, navigate]);

  useEffect(() => {
    if (canManageParishes) {
      fetchParishes({ page, pageSize: 10 });
    }
  }, [page, fetchParishes, canManageParishes]);

  const handleDelete = async (parishId: number) => {
    if (!canDeleteParish) return;
    
    const success = await deleteParish(parishId);
    if (success) {
      // Refresh the list
      fetchParishes({ page, pageSize: 10 });
    }
  };

  const handleEdit = async (parish: Parish) => {
    if (!canEditParish) return;
    
    const fullParish = await fetchParishById(parish.id);
    if (fullParish) {
      setEditingParish(fullParish);
      setShowForm(true);
    }
  };

  const handleCreate = () => {
    if (!canCreateParish) return;
    setEditingParish(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingParish(null);
    fetchParishes({ page, pageSize: 10 });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingParish(null);
  };

  // Don't render anything if user doesn't have basic permissions
  if (!canManageParishes) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('parishes:page.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('parishes:page.subtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            {t('common:backToDashboard')}
          </Button>
          {/* Only show Create button if user has create permission */}
          {canCreateParish && (
            <Button
              variant="contained"
              onClick={handleCreate}
            >
              {t('parishes:page.createNewParish')}
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

      {/* Parishes Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : parishes.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('parishes:page.noParishesFound')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {canCreateParish 
                ? t('parishes:page.getStarted')
                : t('parishes:page.noParishesConfigured')
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <ParishesTable
          parishes={parishes}
          canEditParish={canEditParish}
          canDeleteParish={canDeleteParish}
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

      {/* Parish Form Dialog */}
      {showForm && (canCreateParish || canEditParish) && (
        <ParishFormDialog
          open={showForm}
          parish={editingParish}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          canEdit={canEditParish}
          canCreate={canCreateParish}
          canGetMunicipality={canGetMunicipality}
        />
      )}
    </Container>
  );
};

export default ManageParishes;
