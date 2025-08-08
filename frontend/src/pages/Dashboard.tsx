import { Box, Button, Card, CardContent, Container, IconButton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import LanguageSelector from '@/components/LanguageSelector';
import { usePermissions } from '@/hooks';
import type { AppDispatch, RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { toggleTheme } from '@/store/themeSlice';

const Dashboard: React.FC = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const {
    canManageUsers,
    canManageRoles,
    canManageDepartments,
    canManageCategories,
    canManageItems,
  } = usePermissions();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // Define the type for management sections
  interface ManagementSection {
    title: string;
    description: string;
    route: string;
    color: 'primary' | 'secondary' | 'success' | 'info' | 'warning';
  }

  // Only include sections if user has the required permissions
  const managementSections: ManagementSection[] = [
    ...(canManageUsers ? [{
      title: t('dashboard:manageUsers'), 
      description: t('dashboard:manageUsersDesc'), 
      route: '/users',
      color: 'primary' as const,
    }] : []),
    ...(canManageRoles ? [{
      title: t('dashboard:manageRoles'), 
      description: t('dashboard:manageRolesDesc'), 
      route: '/roles',
      color: 'secondary' as const,
    }] : []),
    ...(canManageDepartments ? [{
      title: t('dashboard:manageDepartments'), 
      description: t('dashboard:manageDepartmentsDesc'), 
      route: '/departments',
      color: 'success' as const,
    }] : []),
    ...(canManageCategories ? [{
      title: t('dashboard:manageCategories'), 
      description: t('dashboard:manageCategoriesDesc'), 
      route: '/categories',
      color: 'info' as const,
    }] : []),
    ...(canManageItems ? [{
      title: t('dashboard:manageItems'), 
      description: t('dashboard:manageItemsDesc'), 
      route: '/items',
      color: 'warning' as const,
    }] : []),
  ];

  const accessibleSections = managementSections;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('dashboard:title')} 
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('dashboard:welcome', { username: user?.username || 'User ' })} 
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

      {/* Management Sections */}
      {accessibleSections.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {accessibleSections.map((section) => (
            <Card 
              key={section.title}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
              onClick={() => navigate(section.route)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {section.description}
                </Typography>
                <Button 
                  variant="contained" 
                  color={section.color}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(section.route);
                  }}
                >
                  {t('dashboard:access')} 
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('dashboard:noSectionsAvailable')} 
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('dashboard:noPermissionsMessage')} 
          </Typography>
        </Box>
      )}

      {/* User Info Section */}
      <Box sx={{ 
        mt: 6, 
        p: 3, 
        bgcolor: themeMode === 'light' ? 'grey.50' : 'grey.900', 
        borderRadius: 2 
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

export default Dashboard;
