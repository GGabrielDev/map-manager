import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { UsersTableProps } from '@/types';

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  canEditUser,
  canDeleteUser,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation();
  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDelete(userId);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('users:components.table.username')}</TableCell>
            <TableCell>{t('users:components.table.roles')}</TableCell>
            {/* Only show Actions column if user has edit or delete permissions */}
            {(canEditUser || canDeleteUser) && (
              <TableCell align="center">{t('users:components.table.actions')}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {user.username}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Chip
                        key={role.id}
                        label={role.name}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))
                    ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('users:components.table.noRolesAssigned')}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              {/* Only show Actions column if user has edit or delete permissions */}
              {(canEditUser || canDeleteUser) && (
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {/* Only show Edit button if user has edit permission */}
                    {canEditUser && (
                      <Tooltip title={t('common:edit')}>
                        <IconButton
                          size="small"
                          onClick={() => onEdit(user)}
                          color="primary"
                        > 
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {/* Only show Delete button if user has delete permission */}
                    {canDeleteUser && (
                      <Tooltip title={t('common:delete')}>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(user.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;
