import React from 'react';
import DashboardCharts from './DashboardCharts';
import ErrorRateChart from './ErrorRateChart';
import ThroughputChart from './ThroughputChart';
import { getAggregateStats, getErrorRates, getThroughput, highlight, toChartData } from '../utility/common';
import { ArtilleryReport } from '../types/artillery';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableRow, TableHead, Tooltip } from '@mui/material';

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

  // Metric explanations for tooltips
  const metricExplanations: { [key: string]: string } = {
    requests: 'Total HTTP requests sent during the test. Higher is usually better.',
    responses: 'Total HTTP responses received from the server. Higher is better.',
    errors: 'Number of requests that did not get a valid response. Lower is better.',
    apdex: 'User satisfaction score (1.0 is best, 0 is worst). Higher is better.',
    throughput: 'Requests per second sent. Higher is better for most systems.',
    data: 'Total amount of data downloaded during the test (bytes). Higher is better.',
    sessionLength: 'Average time a simulated user spent in a session (ms). Lower is usually better.',
    latencyMean: 'Average server response time (ms). Lower is better.',
    latencyP95: '95% of requests were faster than this time (ms). Lower is better.',
    latencyMax: 'Slowest response time observed (ms). Lower is better.',
  };

  // Determine which report is better overall
  let aWins = 0, bWins = 0;
  metrics.forEach(m => {
    const a = aggA[m.key];
    const b = aggB[m.key];
    if (a === b) return;
    if ((m.better === 'higher' && a > b) || (m.better === 'lower' && a < b)) {
      aWins++;
    } else {
      bWins++;
    }
  });
  let summaryLine = '';
  if (aWins > bWins) {
    summaryLine = 'System configuration corresponding to report A behaved better.';
  } else if (bWins > aWins) {
    summaryLine = 'System configuration corresponding to report B behaved better.';
  } else {
    summaryLine = 'Both system configurations performed similarly overall.';
  }

  return (
    <Paper style={{ marginTop: 80 }} sx={{ mt: 6, p: 3 }}>
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
      <Box style={{ marginTop: 50 }} sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Summary of Differences</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell data-testid="metric-header">Metric</TableCell>
              <TableCell align="right" data-testid="report-a-header">Report A</TableCell>
              <TableCell align="right" data-testid="report-b-header">Report B</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.map(m => (
              <Tooltip key={m.key} title={metricExplanations[m.key]} arrow placement="left-start">
                <TableRow>
                  <TableCell>{m.label}</TableCell>
                  <TableCell align="right" style={highlight(aggA[m.key], aggB[m.key], m.better)}>{aggA[m.key]}</TableCell>
                  <TableCell align="right" style={highlight(aggB[m.key], aggA[m.key], m.better)}>{aggB[m.key]}</TableCell>
                </TableRow>
              </Tooltip>
            ))}
          </TableBody>
        </Table>
        <Typography variant="subtitle1" sx={{ mt: 2 }} data-testid="summary-line">
          {summaryLine}
        </Typography>
      </Box>
    </Paper>
  );
};

export default AdvancedComparison;
