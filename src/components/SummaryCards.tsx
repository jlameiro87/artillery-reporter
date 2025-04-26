import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { SummaryAggregate } from '../types/artillery';
import { useTranslation } from 'react-i18next';

interface SummaryCardsProps {
  aggregate: SummaryAggregate;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ aggregate }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
      <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <Card sx={{ bgcolor: (theme) => theme.palette.background.paper, color: (theme) => theme.palette.text.primary }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">{t('total_requests')}</Typography>
            <Typography variant="h5">{aggregate.requests.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <Card sx={{ bgcolor: (theme) => theme.palette.background.paper, color: (theme) => theme.palette.text.primary }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">{t('total_responses')}</Typography>
            <Typography variant="h5">{aggregate.responses.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <Card sx={{ bgcolor: (theme) => theme.palette.background.paper, color: (theme) => theme.palette.text.primary }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">{t('errors')}</Typography>
            <Typography variant="h5" color={aggregate.errors > 0 ? 'error' : 'success.main'}>{aggregate.errors.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <Card sx={{ bgcolor: (theme) => theme.palette.background.paper, color: (theme) => theme.palette.text.primary }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">{t('throughput')}</Typography>
            <Typography variant="h5">{aggregate.throughput.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <Card sx={{ bgcolor: (theme) => theme.palette.background.paper, color: (theme) => theme.palette.text.primary }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">{t('apdex')}</Typography>
            <Typography variant="h5">{aggregate.apdex.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <Card sx={{ bgcolor: (theme) => theme.palette.background.paper, color: (theme) => theme.palette.text.primary }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">{t('data_transferred')}</Typography>
            <Typography variant="h5">{(aggregate.data / 1024 / 1024).toFixed(2)} MB</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <Card sx={{ bgcolor: (theme) => theme.palette.background.paper, color: (theme) => theme.palette.text.primary }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">{t('session_length')}</Typography>
            <Typography variant="h5">{aggregate.sessionLength.toFixed(0)} ms</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <Card sx={{ bgcolor: (theme) => theme.palette.background.paper, color: (theme) => theme.palette.text.primary }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">{t('latency')}</Typography>
            <Typography variant="h5">{aggregate.latencyMean.toFixed(1)} / {aggregate.latencyP95.toFixed(1)} / {aggregate.latencyMax.toFixed(1)} ms</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default SummaryCards;
