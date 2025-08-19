import { Box, Button, Typography } from '@mui/material';

interface QuickAction {
  label: string;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface QuickActionsProps {
  title?: string;
  actions: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({
  title = 'Quick Actions',
  actions
}) => {
  if (actions.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: 1,
        borderColor: 'divider'
      }}>
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outlined"
            color={action.color || 'primary'}
            onClick={action.onClick}
            startIcon={action.icon}
            disabled={action.disabled}
            sx={{ minWidth: 120 }}
          >
            {action.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default QuickActions;
