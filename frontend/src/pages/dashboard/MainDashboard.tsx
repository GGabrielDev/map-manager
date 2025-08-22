import { Box, Button, Container, IconButton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DashboardCard from '@/components/dashboard/DashboardCard';
import QuickActions from '@/components/dashboard/QuickActions';
import LanguageSelector from '@/components/LanguageSelector';
import { usePermissions } from '@/hooks';
import type { AppDispatch, RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { toggleTheme } from '@/store/slices/uiSlice';

const MainDashboard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const themeMode = useSelector((state: RootState) => state.ui.mode);

  const {
    canManageUsers,
    canManageRoles,
    canManageAnySpatial,
  } = usePermissions();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // Quick actions for common tasks
  const quickActions = [
    {
      label: t('dashboard:quickActions.createUser'),
      onClick: () => navigate('/users'),
      color: 'primary' as const,
      icon: '👤',
      disabled: !canManageUsers
    },
    {
      label: t('dashboard:quickActions.manageRoles'),
      onClick: () => navigate('/roles'),
      color: 'secondary' as const,
      icon: '🔐',
      disabled: !canManageRoles
    },
  ];

  // Main dashboard categories
  const dashboardSections = [
    ...(canManageAnySpatial ? [{
      title: t('dashboard:categories.map.title', 'Map'),
      description: t('dashboard:categories.map.description', 'View and manage spatial entities on the map.'),
      route: '/map',
      color: 'info' as const,
      icon: '🗺️'
    }] : []),
    {
      title: t('dashboard:categories.administrative.title'),
      description: t('dashboard:categories.administrative.description'),
      route: '/dashboard/administrative',
      color: 'primary' as const,
      icon: '⚙️'
    },
    {
      title: t('dashboard:categories.geographical.title'),
      description: t('dashboard:categories.geographical.description'),
      route: '/dashboard/geographical',
      color: 'success' as const,
      icon: '🌍'
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('dashboard:title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('dashboard:welcome', { username: user?.username || 'User' })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title={t('dashboard:switchToDark')}>
            <IconButton onClick={handleThemeToggle} color="inherit">
              {themeMode === 'light' ? '🌙' : '☀️'}
            </IconButton>
          </Tooltip>
          <LanguageSelector />
          <Button variant="outlined" onClick={handleLogout}>
            {t('dashboard:logout')}
          </Button>
        </Box>
      </Box>

      {/* Quick Actions */}
      <QuickActions
        title={t('dashboard:quickActions.title')}
        actions={quickActions}
      />

      {/* Dashboard Categories */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        {t('dashboard:categories.title')}
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: 3,
        mb: 4
      }}>
        {dashboardSections.map((section) => (
          <DashboardCard
            key={section.title}
            title={section.title}
            description={section.description}
            route={section.route}
            color={section.color}
            icon={section.icon}
          />
        ))}
      </Box>

      {/* System Overview */}
      <Box sx={{ 
        mt: 6, 
        p: 3, 
        bgcolor: themeMode === 'light' ? 'grey.50' : 'grey.900', 
        borderRadius: 2 
      }}>
        <Typography variant="h6" gutterBottom>
          {t('dashboard:systemOverview.title')}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {user?.roles?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard:systemOverview.assignedRoles')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {user?.roles?.reduce((acc, role) => acc + role.permissions.length, 0) || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard:systemOverview.totalPermissions')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              2
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard:systemOverview.dashboardCategories')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* User Permissions Details */}
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        bgcolor: 'background.paper', 
        borderRadius: 2,
        border: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6" gutterBottom>
          {t('dashboard:yourPermissions')}
        </Typography>
        {user?.roles && user.roles.length > 0 ? (
          <Box>
            {user.roles.map((role) => (
              <Box key={role.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {role.name}
                </Typography>
                <Box sx={{ ml: 2 }}>
                  {role.permissions.map((permission) => (
                    <Typography key={permission.id} variant="body2" color="text.secondary">
                      • {permission.description}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('dashboard:noRolesAssigned')}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default MainDashboard;
