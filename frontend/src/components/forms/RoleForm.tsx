import { 
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useMemo,useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { Permission, RoleFormDialogProps } from '@/types';

const RoleFormDialog: React.FC<RoleFormDialogProps> = ({ 
  open,
  role, 
  onClose, 
  onSuccess, 
  canEdit, 
  canCreate,
  canGetPermission
}) => {
  const { t } = useTranslation();
  const { token } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedPermissions: [] as number[]
  });
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user can perform this action
  const canPerformAction = role ? canEdit : canCreate;

  // Initialize form data when role changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: role?.name || '',
        description: role?.description || '',
        selectedPermissions: role?.permissions?.map(p => p.id) || []
      });
      setError('');
    }
  }, [open, role]);

  // Fetch available permissions with useCallback to prevent unnecessary re-renders
  const fetchPermissions = useCallback(async () => {
    if (!canGetPermission) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/permissions?page=1&pageSize=100`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAvailablePermissions(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
    }
  }, [token, canGetPermission]);

  useEffect(() => {
    if (open && canGetPermission) {
      fetchPermissions();
    }
  }, [open, fetchPermissions, canGetPermission]);

  // Memoized handlers to prevent re-renders
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handlePermissionChange = useCallback((permissionId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      selectedPermissions: e.target.checked
        ? [...prev.selectedPermissions, permissionId]
        : prev.selectedPermissions.filter(id => id !== permissionId)
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPerformAction) {
      setError(t('roles:components.form.accessDenied'));
      return;
    }

    if (!formData.name.trim()) {
      setError(t('roles:components.form.nameRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = role 
        ? `${import.meta.env.VITE_API_URL}/roles/${role.id}`
        : `${import.meta.env.VITE_API_URL}/roles`;
      
      const method = role ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          permissionIds: formData.selectedPermissions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('roles:components.form.failedToCreateRole'));
      }

      onSuccess();
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [canPerformAction, formData, role, token, onSuccess, t]);

  // Memoize permission checkboxes to prevent unnecessary re-renders
  const permissionCheckboxes = useMemo(() => {
    return availablePermissions.map(permission => (
      <FormControlLabel
        key={permission.id}
        control={
          <Checkbox
            checked={formData.selectedPermissions.includes(permission.id)}
            onChange={handlePermissionChange(permission.id)}
            disabled={loading}
          />
        }
        label={
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {permission.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {permission.description}
            </Typography>
          </Box>
        }
      />
    ));
  }, [availablePermissions, formData.selectedPermissions, handlePermissionChange, loading]);

  if (!canPerformAction) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('roles:components.form.accessDenied')}</DialogTitle>
        <DialogContent>
          <Typography color="error">
            {t('roles:components.form.accessDeniedRole', { action: role ? 'edit' : 'create' })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {role ? t('roles:components.form.editRole') : t('roles:components.form.createNewRole')}
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
            label={t('roles:components.form.roleName')}
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleNameChange}
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label={t('roles:components.form.description')}
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleDescriptionChange}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          {/* Only show permissions if user can view them */}
          {canGetPermission && availablePermissions.length > 0 && (
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Permissions</FormLabel>
              <FormGroup>
                <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 1 }}>
                  {permissionCheckboxes}
                </Box>
              </FormGroup>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (role ? t('roles:components.form.updateRole') : t('roles:components.form.createRole'))}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RoleFormDialog;
