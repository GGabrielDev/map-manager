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
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import MunicipalityFormDialog from '@/components/forms/MunicipalityForm';
import MunicipalitiesTable from '@/components/tables/MunicipalitiesTable';
import { usePermissions } from '@/hooks';
import { useMunicipalityManagement } from '@/hooks/entities/useMunicipalities';
import type { Municipality } from '@/types';

const ManageMunicipalities: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingMunicipality, setEditingMunicipality] = useState<Municipality | null>(null);
  
  const {
    canCreateMunicipality,
    canEditMunicipality,
    canDeleteMunicipality,
    canManageMunicipalities,
    canGetState
  } = usePermissions();

  const {
    municipalities,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchMunicipalities,
    fetchMunicipalityById,
    deleteMunicipality,
  } = useMunicipalityManagement();

  // If user doesn't have basic municipality viewing permission, redirect
  useEffect(() => {
    if (!canManageMunicipalities) {
      navigate('/dashboard');
      return;
    }
  }, [canManageMunicipalities, navigate]);

  useEffect(() => {
    if (canManageMunicipalities) {
      fetchMunicipalities({ page, pageSize: 10 });
    }
  }, [page, fetchMunicipalities, canManageMunicipalities]);

  const handleDelete = async (municipalityId: number) => {
    if (!canDeleteMunicipality) return;
    
    const success = await deleteMunicipality(municipalityId);
    if (success) {
      // Refresh the list
      fetchMunicipalities({ page, pageSize: 10 });
    }
  };

  const handleEdit = async (municipality: Municipality) => {
    if (!canEditMunicipality) return;
    
    const fullMunicipality = await fetchMunicipalityById(municipality.id);
    if (fullMunicipality) {
      setEditingMunicipality(fullMunicipality);
      setShowForm(true);
    }
  };

  const handleCreate = () => {
    if (!canCreateMunicipality) return;
    setEditingMunicipality(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingMunicipality(null);
    fetchMunicipalities({ page, pageSize: 10 });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMunicipality(null);
  };

  // Don't render anything if user doesn't have basic permissions
  if (!canManageMunicipalities) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('municipalities:page.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('municipalities:page.subtitle')}
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
          {canCreateMunicipality && (
            <Button
              variant="contained"
              onClick={handleCreate}
            >
              {t('municipalities:page.createNewMunicipality')}
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

      {/* Municipalities Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : municipalities.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('municipalities:page.noMunicipalitiesFound')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {canCreateMunicipality 
                ? t('municipalities:page.getStarted')
                : t('municipalities:page.noMunicipalitiesConfigured')
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <MunicipalitiesTable
          municipalities={municipalities}
          canEditMunicipality={canEditMunicipality}
          canDeleteMunicipality={canDeleteMunicipality}
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

      {/* Municipality Form Dialog */}
      {showForm && (canCreateMunicipality || canEditMunicipality) && (
        <MunicipalityFormDialog
          open={showForm}
          municipality={editingMunicipality}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          canEdit={canEditMunicipality}
          canCreate={canCreateMunicipality}
          canGetState={canGetState}
        />
      )}
    </Container>
  );
};

export default ManageMunicipalities;
