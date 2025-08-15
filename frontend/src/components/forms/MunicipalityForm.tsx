import { 
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { municipalitiesApi, statesApi } from '@/services/api';
import type { RootState } from '@/store';
import type { MunicipalityFormData, MunicipalityFormDialogProps, State } from '@/types/entities';

const MunicipalityFormDialog: React.FC<MunicipalityFormDialogProps> = ({ 
  open,
  municipality, 
  onClose, 
  onSuccess, 
  canEdit, 
  canCreate,
  canGetState
}) => {
  const { t } = useTranslation();
  const { token } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<MunicipalityFormData>({
    name: '',
    stateId: null
  });
  const [availableStates, setAvailableStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user can perform this action
  const canPerformAction = municipality ? canEdit : canCreate;

  // Initialize form data when municipality changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: municipality?.name || '',
        stateId: municipality?.stateId || null
      });
      setError('');
    }
  }, [open, municipality]);

  // Fetch available states with useCallback to prevent unnecessary re-renders
  const fetchStates = useCallback(async () => {
    if (!canGetState || !token) return;
    
    try {
      const response = await statesApi.getStates({
        page: 1,
        pageSize: 100,
      }, token);
      setAvailableStates(response.data || []);
    } catch (err) {
      console.error('Error fetching states:', err);
    }
  }, [token, canGetState]);

  useEffect(() => {
    if (open && canGetState) {
      fetchStates();
    }
  }, [open, fetchStates, canGetState]);

  // Memoized handlers to prevent re-renders
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleStateChange = useCallback((e: any) => {
    setFormData(prev => ({ ...prev, stateId: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPerformAction || !token) {
      setError(t('municipalities:components.form.accessDeniedMunicipality', { action: municipality ? 'edit' : 'create' }));
      return;
    }

    if (!formData.name.trim()) {
      setError(t('municipalities:components.form.missingName'));
      return;
    }

    // Only require stateId for new municipalities
    if (!municipality && !formData.stateId) {
      setError(t('municipalities:components.form.missingState'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (municipality) {
        // Update existing municipality
        await municipalitiesApi.updateMunicipality(municipality.id, {
          name: formData.name.trim()
        }, token);
      } else {
        // Create new municipality
        await municipalitiesApi.createMunicipality({
          name: formData.name.trim(),
          stateId: formData.stateId!
        }, token);
      }

      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(municipality ? t('municipalities:components.form.failedToUpdateMunicipality') : t('municipalities:components.form.failedToCreateMunicipality'));
      }
    } finally {
      setLoading(false);
    }
  }, [canPerformAction, formData, municipality, token, onSuccess, t]);

  if (!canPerformAction) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('municipalities:components.form.accessDenied')}</DialogTitle>
        <DialogContent>
          <Typography color="error">
            {t('municipalities:components.form.accessDeniedMunicipality', { action: municipality ? 'edit' : 'create' })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('common:close')}</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {municipality ? t('municipalities:components.form.editMunicipality') : t('municipalities:components.form.createNewMunicipality')}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label={t('municipalities:components.form.name')}
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleNameChange}
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />

          {/* State selector for new municipalities, or display current state for editing */}
          {canGetState && (
            <>
              {!municipality ? (
                // State selector for new municipalities
                availableStates.length > 0 && (
                  <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                    <InputLabel id="state-select-label">{t('municipalities:components.form.state')}</InputLabel>
                    <Select
                      labelId="state-select-label"
                      value={formData.stateId || ''}
                      label={t('municipalities:components.form.state')}
                      onChange={handleStateChange}
                      required
                      disabled={loading}
                    >
                      <MenuItem value="">
                        <em>{t('municipalities:components.form.selectState')}</em>
                      </MenuItem>
                      {availableStates.map(state => (
                        <MenuItem key={state.id} value={state.id}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )
              ) : (
                // Display current state for editing (read-only)
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {t('municipalities:components.form.state')}
                  </Typography>
                  <Typography variant="body1" sx={{ p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                    {municipality.state?.name || `State ID: ${municipality.stateId}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('municipalities:components.form.stateCannotBeChanged')}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {t('common:cancel')}
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (municipality ? t('municipalities:components.form.updateMunicipality') : t('municipalities:components.form.createMunicipality'))}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MunicipalityFormDialog;
