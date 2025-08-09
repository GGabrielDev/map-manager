import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import useAuth from '@/context/auth/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { t } = useTranslation(['common']);
  const { token, loading, error } = useAuth();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If there's an authentication error, redirect to login
  if (error && !loading) {
    return <Navigate to="/login" replace />;
  }

  // While user data is loading, show a centered spinner with modern styling
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          bgcolor: 'background.default',
          gap: 2
        }}
      >
        <CircularProgress size={48} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          {t('common:loading', 'Loading...')}
        </Typography>
      </Box>
    );
  }

  // If token and user data are available, render the requested component(s)
  return <>{children}</>;
};

export default ProtectedRoute;
