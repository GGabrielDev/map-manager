import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  description: string;
  route: string;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
  icon?: React.ReactNode;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  route,
  color = 'primary',
  icon,
  onClick
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(route);
    }
  };

  return (
    <Card 
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
      onClick={handleClick}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
        {icon && (
          <Box sx={{ mb: 2, fontSize: '2rem' }}>
            {icon}
          </Box>
        )}
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Button 
          variant="contained" 
          color={color}
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {t('dashboard:access')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
