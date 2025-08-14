import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// import { useNavigate } from 'react-router-dom';
import { DashboardCard, NavigationMenu } from '@/components/dashboard';
import { usePermissions } from '@/hooks';

const AdministrativeDashboard: React.FC = () => {
  const { t } = useTranslation();
//const navigate = useNavigate();
  const { canManageUsers, canManageRoles } = usePermissions();

  const navigationItems = [
    { label: 'Users', route: '/users' },
    { label: 'Roles', route: '/roles' },
  ];

  const managementSections = [
    ...(canManageUsers ? [{
      title: t('dashboard:manageUsers'),
      description: t('dashboard:manageUsersDesc'),
      route: '/users',
      color: 'primary' as const,
      icon: '👥'
    }] : []),
    ...(canManageRoles ? [{
      title: t('dashboard:manageRoles'),
      description: t('dashboard:manageRolesDesc'),
      route: '/roles',
      color: 'secondary' as const,
      icon: '🔐'
    }] : []),
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <NavigationMenu
        title="Administrative Dashboard"
        items={navigationItems}
        backRoute="/dashboard"
        backLabel="Back to Main Dashboard"
      />

      {managementSections.length > 0 ? (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 3 
        }}>
          {managementSections.map((section) => (
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
      ) : (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Administrative Sections Available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have permissions to access administrative features.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default AdministrativeDashboard;
