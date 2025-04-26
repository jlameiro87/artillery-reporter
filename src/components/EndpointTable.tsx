import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface EndpointTableProps {
  endpoints: Array<{
    endpoint: string;
    requests: number;
    mean: number;
    p95: number;
    max: number;
    min: number;
    count: number;
  }>;
}

const EndpointTable: React.FC<EndpointTableProps> = ({ endpoints }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h6" gutterBottom>{t('endpoint_latency_breakdown')}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Shows latency statistics for each tested endpoint. Useful for identifying slow or problematic API routes.
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4, bgcolor: (theme) => theme.palette.background.paper }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Endpoint</TableCell>
              <TableCell align="right">{t('total_requests')}</TableCell>
              <TableCell align="right">Mean (ms)</TableCell>
              <TableCell align="right">P95 (ms)</TableCell>
              <TableCell align="right">Max (ms)</TableCell>
              <TableCell align="right">Min (ms)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {endpoints.map(ep => (
              <TableRow key={ep.endpoint}>
                <TableCell>{ep.endpoint}</TableCell>
                <TableCell align="right">{ep.requests.toLocaleString()}</TableCell>
                <TableCell align="right">{ep.mean.toFixed(1)}</TableCell>
                <TableCell align="right">{ep.p95.toFixed(1)}</TableCell>
                <TableCell align="right">{ep.max.toFixed(1)}</TableCell>
                <TableCell align="right">{ep.min.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EndpointTable;
