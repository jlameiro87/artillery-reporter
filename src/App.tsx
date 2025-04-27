import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Paper, CssBaseline, ThemeProvider, createTheme, IconButton, Tabs, Tab } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SummaryCards from './components/SummaryCards';
import DashboardCharts from './components/DashboardCharts';
import EndpointTable from './components/EndpointTable';
import ConfigDesigner from './components/ConfigDesigner';
import type { ArtilleryReport, ArtilleryIntermediateEntry, ChartDataPoint } from './types/artillery';
import { getAggregateStats, getEndpointBreakdown } from './utility/common';
import { useTranslation } from 'react-i18next';
import Menu from './components/Menu';

function App() {
  const { t, i18n } = useTranslation();
  const [report, setReport] = useState<ArtilleryReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

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

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#e53935' }, // Artillery red
      background: darkMode
        ? { default: '#18181b', paper: '#232326' }
        : { default: '#fafafa', paper: '#fff' },
      text: darkMode
        ? { primary: '#fff', secondary: '#bdbdbd' }
        : { primary: '#232326', secondary: '#616161' },
    },
    typography: {
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      h6: { fontWeight: 700 },
    },
  });

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
          <Menu
            showConfig={showConfig}
            setShowConfig={setShowConfig}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            language={i18n.language}
          />
          <IconButton color="inherit" component="a" href="https://www.artillery.io/" target="_blank" rel="noopener" size="large">
            <img src="/vite.svg" alt="Artillery" style={{ height: 32, filter: 'invert(1) grayscale(1) brightness(2)' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {showConfig ? (
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
            <Tab label={t('analyze_report')} />
            <Tab label={t('design_config')} />
          </Tabs>
        ) : null}
        {(!showConfig || tab === 0) && (
          <>
            <Paper sx={{ p: 4, mb: 4, background: theme.palette.background.paper }} elevation={3}>
              <Typography variant="h5" gutterBottom>
                {t('upload_report')}
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                color="primary"
                sx={{ mb: 2 }}
              >
                {t('upload_report_json')}
                <input type="file" accept="application/json" hidden onChange={handleFileUpload} />
              </Button>
              {error && <Typography color="error">{error}</Typography>}
              {report && <Typography color="success.main">{t('report_loaded')}</Typography>}
            </Paper>
            {report && aggregate && (
              <>
                <SummaryCards aggregate={aggregate} />
                <EndpointTable endpoints={endpoints} />
                <DashboardCharts chartData={chartData} />
              </>
            )}
          </>
        )}
        {showConfig && tab === 1 && <ConfigDesigner />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
