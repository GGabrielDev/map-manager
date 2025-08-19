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
  FormLabel,
  Input,
  TextField,
  Typography} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { organismsApi } from '@/services/api';
import type { RootState } from '@/store';
import type { OrganismFormData, OrganismFormDialogProps } from '@/types/entities';

const OrganismFormDialog: React.FC<OrganismFormDialogProps> = ({ 
  open,
  organism, 
  onClose, 
  onSuccess, 
  canEdit, 
  canCreate
}) => {
  const { t } = useTranslation();
  const { token } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<OrganismFormData>({
    name: '',
    icono: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  // Check if user can perform this action
  const canPerformAction = organism ? canEdit : canCreate;

  // Initialize form data when organism changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: organism?.name || '',
        icono: null
      });
      setError('');
      setIconPreview(organism?.icono ? `${import.meta.env.VITE_API_URL}/${organism.icono}` : null);
    }
  }, [open, organism]);

  // Memoized handlers to prevent re-renders
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleIconChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, icono: file }));
    
    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setIconPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setIconPreview(organism?.icono ? `${import.meta.env.VITE_API_URL}/${organism.icono}` : null);
    }
  }, [organism]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPerformAction || !token) {
      setError(t('organisms:components.form.accessDenied'));
      return;
    }

    if (!formData.name.trim()) {
      setError(t('organisms:components.form.nameRequired'));
      return;
    }

    // For new organisms, icon is required
    if (!organism && !formData.icono) {
      setError(t('organisms:components.form.iconRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (organism) {
        // Update existing organism
        const updateData: { name?: string; icono?: File } = {};
        if (formData.name.trim() !== organism.name) {
          updateData.name = formData.name.trim();
        }
        if (formData.icono) {
          updateData.icono = formData.icono;
        }
        
        if (Object.keys(updateData).length > 0) {
          await organismsApi.updateOrganism(organism.id, updateData, token);
        }
      } else {
        // Create new organism
        await organismsApi.createOrganism({
          name: formData.name.trim(),
          icono: formData.icono!
        }, token);
      }

      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(organism ? t('organisms:components.form.failedToUpdate') : t('organisms:components.form.failedToCreate'));
      }
    } finally {
      setLoading(false);
    }
  }, [canPerformAction, formData, organism, token, onSuccess, t]);

  if (!canPerformAction) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('organisms:components.form.accessDenied')}</DialogTitle>
        <DialogContent>
          <Typography color="error">
            {t('organisms:components.form.accessDeniedMessage', { action: organism ? 'edit' : 'create' })}
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
          {organism ? t('organisms:components.form.editOrganism') : t('organisms:components.form.createNewOrganism')}
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
            label={t('organisms:components.form.name')}
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleNameChange}
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <FormLabel component="legend">
              {t('organisms:components.form.icon')} {!organism && '*'}
            </FormLabel>
            <Input
              type="file"
              inputProps={{ 
                accept: 'image/jpeg,image/png',
                'aria-label': t('organisms:components.form.selectIcon')
              }}
              onChange={handleIconChange}
              disabled={loading}
              sx={{ mt: 1 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {t('organisms:components.form.iconHelp')}
            </Typography>
          </FormControl>

          {iconPreview && (
            <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('organisms:components.form.iconPreview')}
              </Typography>
              <Box
                component="img"
                src={iconPreview}
                alt="Icon preview"
                sx={{
                  width: 64,
                  height: 64,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  objectFit: 'contain',
                  backgroundColor: 'background.paper'
                }}
              />
            </Box>
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
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              organism ? t('organisms:components.form.updateOrganism') : t('organisms:components.form.createOrganism')
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OrganismFormDialog;
