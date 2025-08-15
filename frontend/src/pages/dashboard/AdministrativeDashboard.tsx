import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import DashboardCard from '@/components/dashboard/DashboardCard';
import NavigationMenu from '@/components/dashboard/NavigationMenu';
import { usePermissions } from '@/hooks';

const AdministrativeDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { canManageUsers, canManageRoles } = usePermissions();

  const navigationItems = [
    { label: t('dashboard:administrative.navigation.users'), route: '/users' },
    { label: t('dashboard:administrative.navigation.roles'), route: '/roles' },
  ];

  const managementSections = [
    ...(canManageUsers ? [{
      title: t('dashboard:management.users.title'),
      description: t('dashboard:management.users.description'),
      route: '/users',
      color: 'primary' as const,
      icon: '👥'
    }] : []),
    ...(canManageRoles ? [{
      title: t('dashboard:management.roles.title'),
      description: t('dashboard:management.roles.description'),
      route: '/roles',
      color: 'secondary' as const,
      icon: '🔐'
    }] : []),
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <NavigationMenu
        title={t('dashboard:administrative.title')}
        items={navigationItems}
        backRoute="/dashboard"
        backLabel={t('dashboard:administrative.backToMain')}
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
            {t('dashboard:administrative.noSections')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('dashboard:administrative.noPermissions')}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default AdministrativeDashboard;
