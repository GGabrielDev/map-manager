import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useStateManagement } from '@/hooks';
import type { StateFormData,StateFormDialogProps } from '@/types';

const StateFormDialog: React.FC<StateFormDialogProps> = ({
  open,
  state,
  onClose,
  onSuccess,
  canEdit,
  canCreate
}) => {
  const { t } = useTranslation();
  const { createState, updateState } = useStateManagement();
  
  const [formData, setFormData] = useState<StateFormData>({
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const isEditing = Boolean(state);
  const canPerformAction = isEditing ? canEdit : canCreate;

  useEffect(() => {
    if (open) {
      if (state) {
        setFormData({
          name: state.name
        });
      } else {
        setFormData({
          name: ''
        });
      }
      setError('');
    }
  }, [open, state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPerformAction) {
      setError(t('states:components.form.accessDenied'));
      return;
    }

    if (!formData.name.trim()) {
      setError(t('states:components.form.missingStateName'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      let success = false;
      
      if (isEditing && state) {
        success = await updateState(state.id, formData.name.trim());
        if (!success) {
          setError(t('states:components.form.failedToUpdateState'));
        }
      } else {
        success = await createState(formData.name.trim());
        if (!success) {
          setError(t('states:components.form.failedToCreateState'));
        }
      }

      if (success) {
        onSuccess();
      }
    } catch {
      setError(isEditing 
        ? t('states:components.form.failedToUpdateState')
        : t('states:components.form.failedToCreateState')
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

  if (!canPerformAction) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('states:components.form.accessDenied')}
        </DialogTitle>
        <DialogContent>
          <Typography color="error">
            {t('states:components.form.accessDeniedState', { 
              action: isEditing ? 'edit' : 'create' 
            })}
          </Typography>
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
            ? t('states:components.form.editState')
            : t('states:components.form.createNewState')
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
            label={t('states:components.form.stateName')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            required
            sx={{ mt: 1 }}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {t('common:cancel')}
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !formData.name.trim()}
          >
            {isEditing 
              ? t('states:components.form.updateState')
              : t('states:components.form.createState')
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StateFormDialog;
