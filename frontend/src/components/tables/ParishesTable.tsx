import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ParishesTableProps } from '@/types/entities';

const ParishesTable: React.FC<ParishesTableProps> = ({
  parishes,
  canEditParish,
  canDeleteParish,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleDeleteClick = (parishId: number) => {
    setDeleteConfirm(parishId);
  };

  const handleDeleteConfirm = (parishId: number) => {
    onDelete(parishId);
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
                <TableCell>{t('parishes:components.table.name')}</TableCell>
                <TableCell>{t('parishes:components.table.municipality')}</TableCell>
                <TableCell>{t('parishes:components.table.state')}</TableCell>
                <TableCell>{t('parishes:components.table.createdAt')}</TableCell>
                <TableCell align="right">{t('parishes:components.table.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parishes.map((parish) => (
                <TableRow key={parish.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {parish.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {parish.municipality?.name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {parish.municipality?.state?.name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(parish.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {deleteConfirm === parish.id ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => handleDeleteConfirm(parish.id)}
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
                        {canEditParish && (
                          <Tooltip title={t('common:edit')}>
                            <IconButton
                              size="small"
                              onClick={() => onEdit(parish)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canDeleteParish && (
                          <Tooltip title={t('common:delete')}>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(parish.id)}
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

export default ParishesTable;
