import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { State,StatesTableProps } from '@/types';

const StatesTable: React.FC<StatesTableProps> = ({
  states,
  canEditState,
  canDeleteState,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation();
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleDeleteClick = (stateId: number) => {
    setDeleteConfirm(stateId);
  };

  const handleDeleteConfirm = (stateId: number) => {
    onDelete(stateId);
    setDeleteConfirm(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t('states:components.table.stateName')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t('states:components.table.municipalitiesCount')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t('states:components.table.createdAt')}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t('states:components.table.actions')}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {states.map((state: State) => (
                <TableRow key={state.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {state.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={state.Municipalities?.length || 0}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(state.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {deleteConfirm === state.id ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => handleDeleteConfirm(state.id)}
                        >
                          {t('common:confirm')}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleDeleteCancel}
                        >
                          {t('common:cancel')}
                        </Button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                        {canEditState && (
                          <Tooltip title={t('common:edit')}>
                            <IconButton
                              size="small"
                              onClick={() => onEdit(state)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canDeleteState && (
                          <Tooltip title={t('common:delete')}>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(state.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default StatesTable;
