import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { usePermissions } from '@/hooks';

const MapEditor: React.FC = () => {
  const { t } = useTranslation();
  const { canManageAnySpatial } = usePermissions();

  if (!canManageAnySpatial) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Typography variant="h5" color="error" align="center">
          {t('dashboard:permissionDenied', 'You do not have permission to view the map.')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          {t('dashboard:map.title', 'Map Editor')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard:map.description', 'Watch and edit spatial entities directly on the map.')}
        </Typography>
        {/* Map component will go here */}
        <Box sx={{ mt: 6, height: 400, bgcolor: 'grey.100', borderRadius: 2, border: '1px dashed #bbb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            [Map Placeholder]
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default MapEditor;
