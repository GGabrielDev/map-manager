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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { rolesApi, usersApi } from '@/services/api';
import type { RootState } from '@/store';
import type { Role, UserFormData, UserFormDialogProps } from '@/types/auth';

const UserFormDialog: React.FC<UserFormDialogProps> = ({ 
  open,
  user, 
  onClose, 
  onSuccess, 
  canEdit, 
  canCreate,
  canGetRole
}) => {
  const { t } = useTranslation();
  const { token } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    selectedRoles: []
  });
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user can perform this action
  const canPerformAction = user ? canEdit : canCreate;

  // Initialize form data when user changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        username: user?.username || '',
        password: '', // Always start with empty password for security
        selectedRoles: user?.roles?.map(r => r.id) || []
      });
      setError('');
    }
  }, [open, user]);

  // Fetch available roles with useCallback to prevent unnecessary re-renders
  const fetchRoles = useCallback(async () => {
    if (!canGetRole || !token) return;
    
    try {
      const response = await rolesApi.getRoles({
        page: 1,
        pageSize: 100,
      }, token);
      setAvailableRoles(response.data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  }, [token, canGetRole]);

  useEffect(() => {
    if (open && canGetRole) {
      fetchRoles();
    }
  }, [open, fetchRoles, canGetRole]);

  // Memoized handlers to prevent re-renders
  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, username: e.target.value }));
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, password: e.target.value }));
  }, []);

  const handleRoleChange = useCallback((roleId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: e.target.checked
        ? [...prev.selectedRoles, roleId]
        : prev.selectedRoles.filter(id => id !== roleId)
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPerformAction || !token) {
      setError(t('users:components.form.accessDeniedUser', { action: user ? 'edit' : 'create' }));
      return;
    }

    if (!formData.username.trim()) {
      setError(t('users:components.form.missingUsername'));
      return;
    }

    if (!user && !formData.password.trim()) {
      setError(t('users:components.form.missingPassword'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload: {
        username: string;
        roleIds: number[];
        password?: string;
      } = {
        username: formData.username.trim(),
        roleIds: formData.selectedRoles,
      };

      // Only include password if it's provided (for updates) or if it's a new user
      if (formData.password.trim() || !user) {
        payload.password = formData.password.trim();
      }

      if (user) {
        // Update existing user
        await usersApi.updateUser(user.id, payload, token);
      } else {
        // Create new user
        await usersApi.createUser({
          username: payload.username,
          password: payload.password!,
          roleIds: payload.roleIds
        }, token);
      }

      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(user ? t('users:components.form.failedToUpdateUser') : t('users:components.form.failedToCreateUser'));
      }
    } finally {
      setLoading(false);
    }
  }, [canPerformAction, formData, user, token, onSuccess, t]);

  // Memoize role checkboxes to prevent unnecessary re-renders
  const roleCheckboxes = useMemo(() => {
    return availableRoles.map(role => (
      <FormControlLabel
        key={role.id}
        control={
          <Checkbox
            checked={formData.selectedRoles.includes(role.id)}
            onChange={handleRoleChange(role.id)}
            disabled={loading}
          />
        }
        label={
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {role.name}
            </Typography>
            {role.description && (
              <Typography variant="caption" color="text.secondary">
                {role.description}
              </Typography>
            )}
          </Box>
        }
      />
    ));
  }, [availableRoles, formData.selectedRoles, handleRoleChange, loading]);

  if (!canPerformAction) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('users:components.form.accessDenied')}</DialogTitle>
        <DialogContent>
          <Typography color="error">
            {t('users:components.form.accessDeniedUser', { action: user ? 'edit' : 'create' })}
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
          {user ? t('users:components.form.editUser') : t('users:components.form.createNewUser')}
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
            label={t('users:components.form.username')}
            fullWidth
            variant="outlined"
            value={formData.username}
            onChange={handleUsernameChange}
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label={user ? t('users:components.form.password') : t('users:components.form.password')}
            fullWidth
            variant="outlined"
            type="password"
            value={formData.password}
            onChange={handlePasswordChange}
            required={!user} // Required only for new users
            disabled={loading}
            sx={{ mb: 2 }}
          />

          {/* Only show roles if user can view them */}
          {canGetRole && availableRoles.length > 0 && (
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">{t('users:components.form.roles')}</FormLabel>
              <FormGroup>
                <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 1 }}>
                  {roleCheckboxes}
                </Box>
              </FormGroup>
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
            {loading ? <CircularProgress size={20} /> : (user ? t('users:components.form.updateUser') : t('users:components.form.createUser'))}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormDialog;
