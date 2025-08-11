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

import StateFormDialog from '@/components/forms/StateForm';
import StatesTable from '@/components/tables/StatesTable';
import { usePermissions, useStateManagement } from '@/hooks';
import type { State } from '@/types';

const StatesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingState, setEditingState] = useState<State | null>(null);
  
  const {
    canCreateState,
    canEditState,
    canDeleteState,
    canManageStates
  } = usePermissions();

  const {
    states,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchStates,
    fetchStateById,
    deleteState,
  } = useStateManagement();

  // If user doesn't have basic state viewing permission, redirect
  useEffect(() => {
    if (!canManageStates) {
      navigate('/dashboard');
      return;
    }
  }, [canManageStates, navigate]);

  useEffect(() => {
    if (canManageStates) {
      fetchStates(page);
    }
  }, [page, fetchStates, canManageStates]);

  const handleDelete = async (stateId: number) => {
    if (!canDeleteState) return;
    
    const success = await deleteState(stateId);
    if (success) {
      // Refresh the list
      fetchStates(page);
    }
  };

  const handleEdit = async (state: State) => {
    if (!canEditState) return;
    
    const fullState = await fetchStateById(state.id);
    if (fullState) {
      setEditingState(fullState);
      setShowForm(true);
    }
  };

  const handleCreate = () => {
    if (!canCreateState) return;
    setEditingState(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingState(null);
    fetchStates(page);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingState(null);
  };

  // Don't render anything if user doesn't have basic permissions
  if (!canManageStates) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('states:page.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('states:page.subtitle')}
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
          {canCreateState && (
            <Button
              variant="contained"
              onClick={handleCreate}
            >
              {t('states:page.createNewState')}
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

      {/* States Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : states.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('states:page.noStatesFound')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {canCreateState 
                ? t('states:page.getStarted')
                : t('states:page.noStatesConfigured')
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <StatesTable
          states={states}
          canEditState={canEditState}
          canDeleteState={canDeleteState}
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

      {/* State Form Dialog */}
      {showForm && (canCreateState || canEditState) && (
        <StateFormDialog
          open={showForm}
          state={editingState}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          canEdit={canEditState}
          canCreate={canCreateState}
        />
      )}
    </Container>
  );
};

export default StatesPage;
