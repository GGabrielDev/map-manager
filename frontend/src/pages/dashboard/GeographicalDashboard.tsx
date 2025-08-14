import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import DashboardCard from '@/components/dashboard/DashboardCard';
import NavigationMenu from '@/components/dashboard/NavigationMenu';
import { usePermissions } from '@/hooks';

const GeographicalDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { 
    canManageStates, 
    canManageMunicipalities,
    canManageParishes,
  } = usePermissions();

  const navigationItems = [
    { label: t('dashboard:geographical.navigation.states'), route: '/states' },
    { label: t('dashboard:geographical.navigation.municipalities'), route: '/municipalities' },
    { label: t('dashboard:geographical.navigation.parishes'), route: '/parishes' },
  ];

  const managementSections = [
    ...(canManageStates ? [{
      title: t('dashboard:management.states.title'),
      description: t('dashboard:management.states.description'),
      route: '/states',
      color: 'success' as const,
      icon: '🏛️'
    }] : []),
    ...(canManageMunicipalities ? [{
      title: t('dashboard:management.municipalities.title'),
      description: t('dashboard:management.municipalities.description'),
      route: '/municipalities',
      color: 'info' as const,
      icon: '🏘️'
    }] : []),
    ...(canManageParishes ? [{
      title: t('dashboard:management.parishes.title'),
      description: t('dashboard:management.parishes.description'),
      route: '/parishes',
      color: 'primary' as const,
      icon: '🏛️'
    }] : []),
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <NavigationMenu
        title={t('dashboard:geographical.title')}
        items={navigationItems}
        backRoute="/dashboard"
        backLabel={t('dashboard:geographical.backToMain')}
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
            {t('dashboard:geographical.noSections')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('dashboard:geographical.noPermissions')}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default GeographicalDashboard;
