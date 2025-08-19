import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useMunicipalityManagement, useParishManagement } from '@/hooks';
import type { Municipality, ParishFormData, ParishFormDialogProps } from '@/types/entities';

const ParishFormDialog: React.FC<ParishFormDialogProps> = ({
  open,
  parish,
  onClose,
  onSuccess,
  canEdit,
  canCreate,
  canGetMunicipality,
}) => {
  const { t } = useTranslation();
  const { createParish, updateParish } = useParishManagement();
  const { municipalities, fetchMunicipalities } = useMunicipalityManagement();

  const [formData, setFormData] = useState<ParishFormData>({
    name: '',
    municipalityId: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(parish);
  const canSubmit = isEditing ? canEdit : canCreate;

  // Load municipalities when dialog opens
  useEffect(() => {
    if (open && canGetMunicipality) {
      fetchMunicipalities({ page: 1, pageSize: 100 });
    }
  }, [open, canGetMunicipality, fetchMunicipalities]);

  // Initialize form data when parish changes
  useEffect(() => {
    if (parish) {
      setFormData({
        name: parish.name,
        municipalityId: parish.municipalityId,
      });
    } else {
      setFormData({
        name: '',
        municipalityId: null,
      });
    }
    setError('');
  }, [parish]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) {
      setError(t('parishes:components.form.accessDeniedParish', { 
        action: isEditing ? 'edit' : 'create' 
      }));
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      setError(t('parishes:components.form.missingName'));
      return;
    }

    if (!isEditing && !formData.municipalityId) {
      setError(t('parishes:components.form.missingMunicipality'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      let success = false;

      if (isEditing && parish) {
        success = await updateParish(parish.id, {
          name: formData.name.trim(),
        });
      } else if (formData.municipalityId) {
        success = await createParish({
          name: formData.name.trim(),
          municipalityId: formData.municipalityId,
        });
      }

      if (success) {
        onSuccess();
      } else {
        setError(
          isEditing 
            ? t('parishes:components.form.failedToUpdateParish')
            : t('parishes:components.form.failedToCreateParish')
        );
      }
    } catch (err) {
      setError(
        isEditing 
          ? t('parishes:components.form.failedToUpdateParish')
          : t('parishes:components.form.failedToCreateParish')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!canSubmit) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('parishes:components.form.accessDenied')}</DialogTitle>
        <DialogContent>
          <Alert severity="error">
            {t('parishes:components.form.accessDeniedParish', { 
              action: isEditing ? 'edit' : 'create' 
            })}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {t('common:close')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditing 
            ? t('parishes:components.form.editParish')
            : t('parishes:components.form.createNewParish')
          }
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
            label={t('parishes:components.form.name')}
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            required
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth variant="outlined" disabled={loading || isEditing} required={!isEditing}>
            <InputLabel>{t('parishes:components.form.municipality')}</InputLabel>
            <Select
              value={formData.municipalityId || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                municipalityId: e.target.value as number 
              })}
              label={t('parishes:components.form.municipality')}
            >
              <MenuItem value="">
                <em>{t('parishes:components.form.selectMunicipality')}</em>
              </MenuItem>
              {municipalities.map((municipality: Municipality) => (
                <MenuItem key={municipality.id} value={municipality.id}>
                  {municipality.name} ({municipality.state?.name})
                </MenuItem>
              ))}
            </Select>
            {isEditing && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {t('parishes:components.form.municipalityCannotBeChanged')}
              </Typography>
            )}
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {t('common:cancel')}
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {isEditing 
              ? t('parishes:components.form.updateParish')
              : t('parishes:components.form.createParish')
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ParishFormDialog;
