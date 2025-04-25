import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Paper, CssBaseline, ThemeProvider, createTheme, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SummaryCards from './components/SummaryCards';
import DashboardCharts from './components/DashboardCharts';
import EndpointTable from './components/EndpointTable';
import type { ArtilleryReport, ArtilleryIntermediateEntry, ChartDataPoint, SummaryAggregate } from './types/artillery';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#e53935' }, // Artillery red
    background: { default: '#18181b', paper: '#232326' },
    text: { primary: '#fff', secondary: '#bdbdbd' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h6: { fontWeight: 700 },
  },
});

// Helper to extract aggregate stats
function getAggregateStats(report: ArtilleryReport): SummaryAggregate {
  const agg = report?.aggregate;
  if (!agg) {
    return {
      requests: 0,
      responses: 0,
      errors: 0,
      apdex: 0,
      throughput: 0,
      data: 0,
      sessionLength: 0,
      latencyMean: 0,
      latencyP95: 0,
      latencyMax: 0,
    };
  }
  const c = agg.counters || {};
  const r = agg.rates || {};
  const h = agg.histograms || {};
  return {
    requests: c['http.requests'] || 0,
    responses: c['http.responses'] || 0,
    errors: c['http.requests'] - c['http.responses'] || 0,
    apdex: ((c['apdex.satisfied'] || 0) + 0.5 * (c['apdex.tolerated'] || 0)) / (c['http.requests'] || 1),
    throughput: r['http.request_rate'] || 0,
    data: c['http.downloaded_bytes'] || 0,
    sessionLength: h['vusers.session_length']?.mean || 0,
    latencyMean: h['http.response_time']?.mean || 0,
    latencyP95: h['http.response_time']?.p95 || 0,
    latencyMax: h['http.response_time']?.max || 0,
  };
}

// Helper to extract endpoint breakdown
function getEndpointBreakdown(report: ArtilleryReport) {
  const agg = report?.aggregate;
  if (!agg) return [];
  const c = agg.counters || {};
  const h = agg.histograms || {};
  // Find endpoints from keys like plugins.metrics-by-endpoint./dino.codes.200
  const endpoints = Object.keys(c)
    .filter(k => k.startsWith('plugins.metrics-by-endpoint./') && k.endsWith('.codes.200'))
    .map(k => k.replace('plugins.metrics-by-endpoint.', '').replace('.codes.200', ''));
  return endpoints.map(endpoint => {
    const codeKey = `plugins.metrics-by-endpoint.${endpoint}.codes.200`;
    const latencyKey = `plugins.metrics-by-endpoint.response_time.${endpoint}`;
    const latency = h[latencyKey] || {};
    return {
      endpoint,
      requests: c[codeKey] || 0,
      mean: latency.mean || 0,
      p95: latency.p95 || 0,
      max: latency.max || 0,
      min: latency.min || 0,
      count: latency.count || 0,
    };
  });
}

function App() {
  const [report, setReport] = useState<ArtilleryReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        setReport(json);
        setError(null);
      } catch {
        setError('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Prepare data for charts
  let chartData: ChartDataPoint[] = [];
  if (report?.intermediate) {
    chartData = report.intermediate.map((entry: ArtilleryIntermediateEntry, idx: number) => ({
      name: `T${idx + 1}`,
      requests: entry.counters?.['http.requests'] || 0,
      responses: entry.counters?.['http.responses'] || 0,
      apdex_tolerated: entry.counters?.['apdex.tolerated'] || 0,
      apdex_frustrated: entry.counters?.['apdex.frustrated'] || 0,
      request_rate: entry.rates?.['http.request_rate'] || 0,
      p50: entry.summaries?.['http.response_time']?.p50 || 0,
      p90: entry.summaries?.['http.response_time']?.p90 || 0,
      p99: entry.summaries?.['http.response_time']?.p99 || 0,
    }));
  }

  const aggregate = getAggregateStats(report ?? {} as ArtilleryReport);
  const endpoints = getEndpointBreakdown(report ?? {} as ArtilleryReport);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, letterSpacing: 2 }}>
            Artillery Report Analyzer
          </Typography>
          <IconButton color="inherit" component="a" href="https://www.artillery.io/" target="_blank" rel="noopener" size="large">
            <img src="/vite.svg" alt="Artillery" style={{ height: 32, filter: 'invert(1) grayscale(1) brightness(2)' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, mb: 4, background: theme.palette.background.paper }} elevation={3}>
          <Typography variant="h5" gutterBottom>
            Upload Artillery Report
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            color="primary"
            sx={{ mb: 2 }}
          >
            Upload report.json
            <input type="file" accept="application/json" hidden onChange={handleFileUpload} />
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          {report && <Typography color="success.main">Report loaded successfully!</Typography>}
        </Paper>
        {report && aggregate && (
          <>
            <SummaryCards aggregate={aggregate} />
            <EndpointTable endpoints={endpoints} />
            <DashboardCharts chartData={chartData} />
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
