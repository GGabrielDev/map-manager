import 'leaflet/dist/leaflet.css';

import { Box, Button, Paper, styled, Typography } from '@mui/material';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
// Fix for default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

import { usePermissions } from '@/hooks';

// Properly typed icon fix
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const FullscreenMapContainer = styled(Box)(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 1,
}));

const Overlay = styled(Box)(() => ({
  position: 'absolute',
  zIndex: 10,
  bottom: 0,
  left: 0,
  width: '100vw',
  pointerEvents: 'none',
}));

const OverlayContent = styled(Box)(({ theme }) => ({
  pointerEvents: 'auto',
  margin: theme.spacing(4),
}));

const MapEditor: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { canManageAnySpatial } = usePermissions();

  const centerCoords: LatLngExpression = [8.345380014941664, -62.690057677741386];

  if (!canManageAnySpatial) {
    return (
      <Overlay>
        <Paper sx={{ pointerEvents: 'auto', m: 4 }} elevation={3}>
          <Typography variant="h5" color="error" align="center">
            {t('dashboard:permissionDenied', 'You do not have permission to view the map.')}
          </Typography>
        </Paper>
      </Overlay>
    );
  }

  return (
    <>
      <FullscreenMapContainer>
        <MapContainer center={centerCoords} zoom={12} style={{ width: '100vw', height: '100vh' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </FullscreenMapContainer>
      <Overlay>
        <OverlayContent>
          <Button
            variant='contained'
            onClick={() => navigate('/dashboard')}
          >
            ⬅️ {t('common:backToDashboard')}
          </Button>
        </OverlayContent>
      </Overlay>
    </>
  );
};

export default MapEditor;
