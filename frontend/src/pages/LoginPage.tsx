import { Alert,Box, Button, Container, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store';
import { fetchUser,login } from '@/store/authSlice';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login({ username, password }));
      if (login.fulfilled.match(resultAction)) {
        // Extract userId from token payload (simple decode for demo - in production use proper JWT library)
        const token = resultAction.payload as string;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.userId;
          await dispatch(fetchUser(userId));
          navigate('/dashboard');
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          // If token decode fails, still navigate to dashboard
          // The user fetch can be handled differently in production
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // Error handling already captured in state
      console.error('Login error:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('auth:title')}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('auth:login')}
        </Typography>
        {authState.error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {authState.error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
          <TextField
            label={t('auth:username')}
            variant="outlined"
            margin="normal"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={authState.status === 'loading'}
          />
          <TextField
            label={t('auth:password')}
            variant="outlined"
            margin="normal"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={authState.status === 'loading'}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 3, mb: 2 }}
            disabled={authState.status === 'loading'}
          >
            {authState.status === 'loading' ? t('auth:loggingIn') : t('auth:login')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
