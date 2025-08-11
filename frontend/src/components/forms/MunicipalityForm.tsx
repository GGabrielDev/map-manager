import { 
  Alert,
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
    if (!canGetState) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/states?page=1&pageSize=100`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAvailableStates(data.data || []);
      }
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
    
    if (!canPerformAction) {
      setError(t('municipalities:components.form.accessDeniedMunicipality', { action: municipality ? 'edit' : 'create' }));
      return;
    }

    if (!formData.name.trim()) {
      setError(t('municipalities:components.form.missingName'));
      return;
    }

    if (!formData.stateId) {
      setError(t('municipalities:components.form.missingState'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = municipality 
        ? `${import.meta.env.VITE_API_URL}/api/municipalities/${municipality.id}`
        : `${import.meta.env.VITE_API_URL}/api/municipalities`;
      
      const method = municipality ? 'PUT' : 'POST';

      const payload = municipality 
        ? { name: formData.name.trim() }
        : { name: formData.name.trim(), stateId: formData.stateId };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (municipality ? t('municipalities:components.form.failedToUpdateMunicipality') : t('municipalities:components.form.failedToCreateMunicipality')));
      }

      onSuccess();
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
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

          {/* Only show state selector for new municipalities */}
          {!municipality && canGetState && availableStates.length > 0 && (
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
