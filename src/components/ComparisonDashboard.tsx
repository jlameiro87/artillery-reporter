import React from 'react';
import DashboardCharts from './DashboardCharts';
import ErrorRateChart from './ErrorRateChart';
import LatencyBreakdownChart from './LatencyBreakdownChart';
import ThroughputChart from './ThroughputChart';
import ScenarioCompletionChart from './ScenarioCompletionChart';
import { getAggregateStats, getErrorRates, getLatencyBreakdown, getThroughput, getScenarioCompletion, createResource } from '../utility/common';
import { ArtilleryIntermediateEntry, ArtilleryReport, ChartDataPoint } from '../types/artillery';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';

function highlight(valA: number, valB: number, better: 'lower' | 'higher') {
  if (valA === valB) return {};
  if ((better === 'lower' && valA < valB) || (better === 'higher' && valA > valB)) {
    return { fontWeight: 'bold', color: '#43a047' };
  }
  return { fontWeight: 'bold', color: '#e53935' };
}

const toChartData = (intermediate: ArtilleryIntermediateEntry[] | undefined): ChartDataPoint[] =>
  (intermediate || []).map((entry, idx) => ({
    name: `T${idx + 1}`,
    requests: entry.counters?.["http.requests"] || 0,
    responses: entry.counters?.["http.responses"] || 0,
    apdex_tolerated: entry.counters?.["apdex.tolerated"] || 0,
    apdex_frustrated: entry.counters?.["apdex.frustrated"] || 0,
    request_rate: entry.rates?.["http.request_rate"] || 0,
    p50: entry.summaries?.["http.response_time"]?.p50 || 0,
    p90: entry.summaries?.["http.response_time"]?.p90 || 0,
    p99: entry.summaries?.["http.response_time"]?.p99 || 0,
  }));

const AdvancedComparison: React.FC<{ reportA: ArtilleryReport, reportB: ArtilleryReport }> = ({ reportA, reportB }) => {
  const aggA = getAggregateStats(reportA);
  const aggB = getAggregateStats(reportB);
  // Define which metrics are better when lower/higher
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

interface ReportDashboardProps {
  resourceA: ReturnType<typeof createResource<ArtilleryReport>>;
  resourceB: ReturnType<typeof createResource<ArtilleryReport>>;
}

const ComparisonDashboard: React.FC<ReportDashboardProps> = ({ resourceA, resourceB }) => {
  const reportA = resourceA.read();
  const reportB = resourceB.read();
  return (
    <>
      <Box sx={{ display: 'flex', gap: 4, mb: 6 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>Report A</Typography>
          <DashboardCharts chartData={toChartData(reportA.intermediate)} />
          <ErrorRateChart data={getErrorRates(reportA)} />
          <LatencyBreakdownChart data={getLatencyBreakdown(reportA)} />
          <ThroughputChart data={getThroughput(reportA)} />
          <ScenarioCompletionChart data={getScenarioCompletion(reportA)} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>Report B</Typography>
          <DashboardCharts chartData={toChartData(reportB.intermediate)} />
          <ErrorRateChart data={getErrorRates(reportB)} />
          <LatencyBreakdownChart data={getLatencyBreakdown(reportB)} />
          <ThroughputChart data={getThroughput(reportB)} />
          <ScenarioCompletionChart data={getScenarioCompletion(reportB)} />
        </Box>
      </Box>
      <AdvancedComparison reportA={reportA} reportB={reportB} />
    </>
  );
};

export default ComparisonDashboard;
