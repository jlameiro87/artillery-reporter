import { render, screen } from '@testing-library/react';
import DashboardCharts from '../components/DashboardCharts';
import { ThemeProvider, createTheme } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

describe('DashboardCharts', () => {
  const chartData = [
    { name: 'T1', requests: 10, responses: 10, apdex_tolerated: 8, apdex_frustrated: 2, request_rate: 5, p50: 100, p90: 200, p99: 300 },
    { name: 'T2', requests: 20, responses: 19, apdex_tolerated: 15, apdex_frustrated: 4, request_rate: 10, p50: 110, p90: 210, p99: 310 },
  ];

  it('renders chart section titles', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={createTheme()}>
          <DashboardCharts chartData={chartData} />
        </ThemeProvider>
      </I18nextProvider>
    );
    expect(screen.getByText(/Requests & Responses Over Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Response Time Percentiles/i)).toBeInTheDocument();
    expect(screen.getByText(/Request Rate & Apdex/i)).toBeInTheDocument();
  });
});
