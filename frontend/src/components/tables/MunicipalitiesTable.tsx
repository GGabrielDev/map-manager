import { Delete as DeleteIcon,Edit as EditIcon } from '@mui/icons-material';
import {
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

import type { MunicipalitiesTableProps } from '@/types/entities';

const MunicipalitiesTable: React.FC<MunicipalitiesTableProps> = ({
  municipalities,
  canEditMunicipality,
  canDeleteMunicipality,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const handleDelete = (municipalityId: number) => {
    if (window.confirm(t('municipalities:components.form.confirmDelete'))) {
      onDelete(municipalityId);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('municipalities:components.table.name')}</TableCell>
            <TableCell>{t('municipalities:components.table.state')}</TableCell>
            <TableCell>{t('municipalities:components.table.parishesCount')}</TableCell>
            <TableCell>{t('municipalities:components.table.createdAt')}</TableCell>
            {/* Only show Actions column if user has edit or delete permissions */}
            {(canEditMunicipality || canDeleteMunicipality) && (
              <TableCell align="center">{t('municipalities:components.table.actions')}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {municipalities.map((municipality) => (
            <TableRow key={municipality.id}>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {municipality.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {municipality.state?.name || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {municipality.parishes?.length || 0}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {new Date(municipality.createdAt).toLocaleDateString()}
                </Typography>
              </TableCell>
              {(canEditMunicipality || canDeleteMunicipality) && (
                <TableCell align="center">
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {canEditMunicipality && (
                      <Tooltip title={t('common:edit')}>
                        <IconButton
                          size="small"
                          onClick={() => onEdit(municipality)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {canDeleteMunicipality && (
                      <Tooltip title={t('common:delete')}>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(municipality.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MunicipalitiesTable;
