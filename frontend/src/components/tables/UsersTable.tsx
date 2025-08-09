import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography} from '@mui/material';

import type { UsersTableProps } from '@/types';

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  canEditUser,
  canDeleteUser,
  onEdit,
  onDelete
}) => {
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
            <TableCell>Username</TableCell>
            <TableCell>Roles</TableCell>
            {/* Only show Actions column if user has edit or delete permissions */}
            {(canEditUser || canDeleteUser) && (
              <TableCell align="center">Actions</TableCell>
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
                      No roles assigned
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
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => onEdit(user)}
                      >
                        Edit
                      </Button>
                    )}
                    {/* Only show Delete button if user has delete permission */}
                    {canDeleteUser && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
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
