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
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { Role, UserFormData,UserFormDialogProps } from '@/types';

const UserFormDialog: React.FC<UserFormDialogProps> = ({ 
  open,
  user, 
  onClose, 
  onSuccess, 
  canEdit, 
  canCreate,
  canGetRole
}) => {
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
    if (!canGetRole) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/roles?page=1&pageSize=100`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAvailableRoles(data.data || []);
      }
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
    
    if (!canPerformAction) {
      setError('You do not have permission to perform this action');
      return;
    }

    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!user && !formData.password.trim()) {
      setError('Password is required for new users');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = user 
        ? `${import.meta.env.VITE_API_URL}/users/${user.id}`
        : `${import.meta.env.VITE_API_URL}/users`;
      
      const method = user ? 'PUT' : 'POST';

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
        throw new Error(data.error || 'Failed to save user');
      }

      onSuccess();
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [canPerformAction, formData, user, token, onSuccess]);

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
        <DialogTitle>Access Denied</DialogTitle>
        <DialogContent>
          <Typography color="error">
            You do not have permission to {user ? 'edit' : 'create'} users.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {user ? 'Edit User' : 'Create New User'}
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
            label="Username"
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
            label={user ? 'New Password (leave empty to keep current)' : 'Password'}
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
              <FormLabel component="legend">Roles</FormLabel>
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
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (user ? 'Update User' : 'Create User')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormDialog;
