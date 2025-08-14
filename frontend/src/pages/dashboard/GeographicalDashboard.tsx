import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

//import { useNavigate } from 'react-router-dom';
import { DashboardCard, NavigationMenu } from '@/components/dashboard';
import { usePermissions } from '@/hooks';

const GeographicalDashboard: React.FC = () => {
  const { t } = useTranslation();
//const navigate = useNavigate();
  const { 
    canManageStates, 
    canManageMunicipalities,
  } = usePermissions();

  const navigationItems = [
    { label: 'States', route: '/states' },
    { label: 'Municipalities', route: '/municipalities' },
  ];

  const managementSections = [
    ...(canManageStates ? [{
      title: t('dashboard:manageStates'),
      description: t('dashboard:manageStatesDesc'),
      route: '/states',
      color: 'success' as const,
      icon: '🏛️'
    }] : []),
    ...(canManageMunicipalities ? [{
      title: t('dashboard:manageMunicipalities'),
      description: t('dashboard:manageMunicipalitiesDesc'),
      route: '/municipalities',
      color: 'info' as const,
      icon: '🏘️'
    }] : []),
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <NavigationMenu
        title="Geographical Dashboard"
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
            No Geographical Sections Available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have permissions to access geographical management features.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default GeographicalDashboard;
