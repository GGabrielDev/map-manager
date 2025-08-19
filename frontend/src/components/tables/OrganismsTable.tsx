import { Delete as DeleteIcon,Edit as EditIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
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

import type { OrganismsTableProps } from '@/types/entities';

const OrganismsTable: React.FC<OrganismsTableProps> = ({
  organisms,
  canEditOrganism,
  canDeleteOrganism,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="organisms table">
        <TableHead>
          <TableRow>
            <TableCell>{t('organisms:table.icon')}</TableCell>
            <TableCell>{t('organisms:table.name')}</TableCell>
            <TableCell>{t('organisms:table.createdAt')}</TableCell>
            <TableCell>{t('organisms:table.updatedAt')}</TableCell>
            <TableCell align="right">{t('organisms:table.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {organisms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body2" color="text.secondary">
                  {t('organisms:table.noOrganisms')}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            organisms.map((organism) => (
              <TableRow
                key={organism.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {organism.icono ? (
                      <Avatar
                        src={`${import.meta.env.VITE_API_URL}/${organism.icono}`}
                        alt={organism.name}
                        sx={{ 
                          width: 32, 
                          height: 32,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                        variant="rounded"
                      />
                    ) : (
                      <Avatar
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: 'grey.300',
                          color: 'grey.600'
                        }}
                        variant="rounded"
                      >
                        {organism.name.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                  </Box>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight="medium">
                    {organism.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(organism.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(organism.updatedAt)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {canEditOrganism && (
                      <Tooltip title={t('organisms:table.editOrganism')}>
                        <IconButton
                          size="small"
                          onClick={() => onEdit(organism)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {canDeleteOrganism && (
                      <Tooltip title={t('organisms:table.deleteOrganism')}>
                        <IconButton
                          size="small"
                          onClick={() => onDelete(organism.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrganismsTable;
