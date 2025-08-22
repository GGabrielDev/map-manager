import 'leaflet/dist/leaflet.css';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import RemoveIcon from '@mui/icons-material/Remove';
import SatelliteIcon from '@mui/icons-material/Satellite';
import type { SelectChangeEvent } from '@mui/material';
import { 
  Box, 
  Button, 
  FormControl,
  IconButton,
  MenuItem, 
  Paper, 
  Select, 
  styled, 
  Tooltip, 
  Typography} from '@mui/material';
import type { LatLngExpression , Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
// Fix for default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useRef,useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { usePermissions } from '@/hooks';
import type { AppDispatch, RootState } from '@/store';
import { setMapState } from '@/store/slices/mapSlice';

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
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  flexWrap: 'wrap',
}));

const ZoomControlContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: 1000,
  pointerEvents: 'auto',
}));

type LayerType = 'default' | 'dark' | 'satellite';

interface TileLayerConfig {
  url: string;
  attribution: string;
  label: string;
  icon: React.ReactNode;
}

const tileLayers: Record<LayerType, TileLayerConfig> = {
  default: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    label: 'default',
    icon: <MapIcon fontSize="small" />
  },
  dark: {
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    label: 'dark',
    icon: <DarkModeIcon fontSize="small" />
  },
  satellite: {
    // // Using Esri satellite (recommended)
    // url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    // attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    
    // If you really need Google (not recommended):
    url: 'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
    label: 'satellite',
    icon: <SatelliteIcon fontSize="small" />
  }
};

// Component to handle map events and dispatch state changes
const MapEventHandler: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      dispatch(setMapState({
        center: [center.lat, center.lng],
        zoom: map.getZoom(),
      }));
    },
    zoomend: () => {
      const center = map.getCenter();
      dispatch(setMapState({
        center: [center.lat, center.lng],
        zoom: map.getZoom(),
      }));
    },
  });
  return null;
};

const MapEditor: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { canManageAnySpatial } = usePermissions();
  
  // Get map state from Redux store
  const mapState = useSelector((state: RootState) => state.map);
  const [selectedLayer, setSelectedLayer] = useState<LayerType>('satellite'); // You might want to persist this too
  const mapRef = useRef<LeafletMap | null>(null);

  // Use mapState from Redux for initial center and zoom
  const initialCenter: LatLngExpression = mapState.center;
  const initialZoom: number = mapState.zoom;

  const handleLayerChange = (event: SelectChangeEvent<LayerType>) => {
    setSelectedLayer(event.target.value as LayerType);
  };
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

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

  const currentLayer = tileLayers[selectedLayer];

  return (
    <>
      <FullscreenMapContainer>
        <MapContainer 
          ref={mapRef}
          center={initialCenter} 
          zoom={initialZoom}
          style={{ width: '100vw', height: '100vh' }}
          zoomControl={false} // Disable default zoom controls
        >
          <TileLayer
            key={selectedLayer}
            attribution={currentLayer.attribution}
            url={currentLayer.url}
          />
          <MapEventHandler />
        </MapContainer>
      </FullscreenMapContainer>

      {/* Custom Zoom Controls */}
      <ZoomControlContainer>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: '50%',
              overflow: 'hidden'
            }}
          >
            <IconButton 
              onClick={handleZoomIn}
              aria-label="zoom in"
              sx={{ 
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Paper>
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: '50%',
              overflow: 'hidden'
            }}
          >
            <IconButton 
              onClick={handleZoomOut}
              aria-label="zoom out"
              sx={{ 
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Paper>
        </Box>
      </ZoomControlContainer>

      {/* Bottom Overlay */}
      <Overlay>
        <OverlayContent>
          <Paper elevation={1} sx={{ display: 'inline-flex' }}>
            <Tooltip title={t('common:backToDashboard', 'Back to Dashboard')}>
            <Button
              onClick={() => navigate('/dashboard')}
              sx={{ 
                minHeight: 39,
                border: 'none',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <ArrowBackIcon />
            </Button>
            </Tooltip>
          </Paper>
          
          <Paper elevation={1} sx={{ display: 'inline-flex' }}>
            <FormControl size="small" variant="standard">
              <Select
                value={selectedLayer}
                onChange={handleLayerChange}
                displayEmpty
                disableUnderline
                startAdornment={<LayersIcon sx={{ mr: 1, color: 'action.active' }} />}
                sx={{ 
                  minWidth: 150,
                  px: 1,
                  '& .MuiSelect-select': {
                    py: 1,
                  }
                }}
              >
                {(Object.keys(tileLayers) as LayerType[]).map((layerKey) => (
                  <MenuItem key={layerKey} value={layerKey}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tileLayers[layerKey].icon}
                      {t(`map:layers.${tileLayers[layerKey].label}`)}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </OverlayContent>
      </Overlay>
    </>
  );
};

export default MapEditor;
