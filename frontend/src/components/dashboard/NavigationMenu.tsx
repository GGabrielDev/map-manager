import { Box, Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

interface NavigationMenuProps {
  title: string;
  items: NavigationItem[];
  backRoute?: string;
  backLabel?: string;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  title,
  items,
  backRoute,
  backLabel = 'Back to Main Dashboard'
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {backRoute && (
          <Button 
            variant="outlined" 
            onClick={() => navigate(backRoute)}
          >
            {backLabel}
          </Button>
        )}
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        borderBottom: 1,
        borderColor: 'divider',
        pb: 2
      }}>
        {items.map((item) => (
          <Button
            key={item.route}
            variant={location.pathname === item.route ? 'contained' : 'outlined'}
            onClick={() => navigate(item.route)}
            startIcon={item.icon}
            sx={{ minWidth: 120 }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default NavigationMenu;
