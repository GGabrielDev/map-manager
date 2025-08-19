import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Snackbar,
  TextField,
  Typography} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import OrganismFormDialog from '@/components/forms/OrganismForm';
import OrganismsTable from '@/components/tables/OrganismsTable';
import { usePermissions } from '@/hooks/auth/usePermissions';
import { useOrganismManagement } from '@/hooks/entities/useOrganisms';
import type { Organism } from '@/types/entities';

const OrganismsPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    organisms,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchOrganisms,
    deleteOrganism,
  } = useOrganismManagement();

  const { hasPermission } = usePermissions();

  // Permission checks
  const canCreateOrganism = hasPermission('create_organism');
  const canEditOrganism = hasPermission('edit_organism');
  const canDeleteOrganism = hasPermission('delete_organism');

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedOrganism, setSelectedOrganism] = useState<Organism | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [organismToDelete, setOrganismToDelete] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Load organisms on component mount
  useEffect(() => {
    fetchOrganisms();
  }, [fetchOrganisms]);

  // Handle search
  const handleSearch = useCallback(() => {
    fetchOrganisms({
      page: 1,
      pageSize: 10,
      name: searchTerm || undefined,
    });
  }, [fetchOrganisms, searchTerm]);

  // Handle page change
  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    fetchOrganisms({
      page: newPage,
      pageSize: 10,
      name: searchTerm || undefined,
    });
  }, [setPage, fetchOrganisms, searchTerm]);

  // Handle create organism
  const handleCreateOrganism = useCallback(() => {
    setSelectedOrganism(null);
    setFormOpen(true);
  }, []);

  // Handle edit organism
  const handleEditOrganism = useCallback((organism: Organism) => {
    setSelectedOrganism(organism);
    setFormOpen(true);
  }, []);

  // Handle delete organism
  const handleDeleteOrganism = useCallback((organismId: number) => {
    setOrganismToDelete(organismId);
    setDeleteDialogOpen(true);
  }, []);

  // Confirm delete
  const confirmDelete = useCallback(async () => {
    if (organismToDelete) {
      const success = await deleteOrganism(organismToDelete);
      if (success) {
        setSuccessMessage(t('organisms:messages.deleteSuccess'));
        fetchOrganisms(); // Refresh the list
      }
    }
    setDeleteDialogOpen(false);
    setOrganismToDelete(null);
  }, [organismToDelete, deleteOrganism, fetchOrganisms, t]);

  // Handle form success
  const handleFormSuccess = useCallback(() => {
    setFormOpen(false);
    setSelectedOrganism(null);
    setSuccessMessage(
      selectedOrganism 
        ? t('organisms:messages.updateSuccess')
        : t('organisms:messages.createSuccess')
    );
    fetchOrganisms(); // Refresh the list
  }, [selectedOrganism, fetchOrganisms, t]);

  // Handle form close
  const handleFormClose = useCallback(() => {
    setFormOpen(false);
    setSelectedOrganism(null);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('organisms:title')}
      </Typography>

      {/* Search and Actions */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={t('organisms:searchAndActions')}
          action={
            canCreateOrganism && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateOrganism}
              >
                {t('organisms:createOrganism')}
              </Button>
            )
          }
        />
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label={t('organisms:searchByName')}
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              {t('common:search')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Organisms Table */}
      <Card>
        <CardHeader title={t('organisms:organismsList')} />
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Typography>{t('common:loading')}</Typography>
            </Box>
          ) : (
            <>
              <OrganismsTable
                organisms={organisms}
                canEditOrganism={canEditOrganism}
                canDeleteOrganism={canDeleteOrganism}
                onEdit={handleEditOrganism}
                onDelete={handleDeleteOrganism}
              />
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Organism Form Dialog */}
      <OrganismFormDialog
        open={formOpen}
        organism={selectedOrganism}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        canEdit={canEditOrganism}
        canCreate={canCreateOrganism}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t('organisms:deleteConfirmation.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {t('organisms:deleteConfirmation.message')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('common:cancel')}
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            {t('common:delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrganismsPage;
