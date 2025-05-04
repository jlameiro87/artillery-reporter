import React from 'react';
import DashboardCharts from './DashboardCharts';
import ErrorRateChart from './ErrorRateChart';
import ThroughputChart from './ThroughputChart';
import { getAggregateStats, getErrorRates, getThroughput, highlight, toChartData } from '../utility/common';
import { ArtilleryReport } from '../types/artillery';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';

const AdvancedComparison: React.FC<{ reportA: ArtilleryReport, reportB: ArtilleryReport }> = ({ reportA, reportB }) => {
  const aggA = getAggregateStats(reportA);
  const aggB = getAggregateStats(reportB);
  const metrics: { key: keyof typeof aggA; label: string; better: 'lower' | 'higher' }[] = [
    { key: 'requests', label: 'Total Requests', better: 'higher' },
    { key: 'responses', label: 'Total Responses', better: 'higher' },
    { key: 'errors', label: 'Total Errors', better: 'lower' },
    { key: 'apdex', label: 'Apdex', better: 'higher' },
    { key: 'throughput', label: 'Request Rate', better: 'higher' },
    { key: 'data', label: 'Downloaded Data', better: 'higher' },
    { key: 'sessionLength', label: 'Session Length', better: 'lower' },
    { key: 'latencyMean', label: 'Mean Latency', better: 'lower' },
    { key: 'latencyP95', label: 'P95 Latency', better: 'lower' },
    { key: 'latencyMax', label: 'Max Latency', better: 'lower' },
  ];
  return (
    <Paper sx={{ mt: 6, p: 3 }}>
      <Typography variant="h5" gutterBottom>Advanced Comparison</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Overlayed charts and a summary table highlight which report performed better for each metric.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        <Box sx={{ flex: 1, minWidth: 350 }}>
          <Typography variant="h6" align="center">Overlay: Response Time Percentiles</Typography>
          <DashboardCharts chartDataA={toChartData(reportA.intermediate)} chartDataB={toChartData(reportB.intermediate)} overlay />
        </Box>
        <Box sx={{ flex: 1, minWidth: 350 }}>
          <Typography variant="h6" align="center">Overlay: Error Rate</Typography>
          <ErrorRateChart dataA={getErrorRates(reportA)} dataB={getErrorRates(reportB)} overlay />
        </Box>
        <Box sx={{ flex: 1, minWidth: 350 }}>
          <Typography variant="h6" align="center">Overlay: Throughput</Typography>
          <ThroughputChart dataA={getThroughput(reportA)} dataB={getThroughput(reportB)} overlay />
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Summary of Differences</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell align="right">Report A</TableCell>
              <TableCell align="right">Report B</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.map(m => (
              <TableRow key={m.key}>
                <TableCell>{m.label}</TableCell>
                <TableCell align="right" style={highlight(aggA[m.key], aggB[m.key], m.better)}>{aggA[m.key]}</TableCell>
                <TableCell align="right" style={highlight(aggB[m.key], aggA[m.key], m.better)}>{aggB[m.key]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default AdvancedComparison;
