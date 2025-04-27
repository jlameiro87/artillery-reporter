import { render, screen } from '@testing-library/react';
import EndpointTable from '../components/EndpointTable';
import { ThemeProvider, createTheme } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

describe('EndpointTable', () => {
  const endpoints = [
    { endpoint: '/api', requests: 10, mean: 100, p95: 200, max: 300, min: 50, count: 10 },
    { endpoint: '/health', requests: 5, mean: 80, p95: 120, max: 150, min: 60, count: 5 },
  ];

  it('renders endpoint rows', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={createTheme()}>
          <EndpointTable endpoints={endpoints} />
        </ThemeProvider>
      </I18nextProvider>
    );
    expect(screen.getByText('/api')).toBeInTheDocument();
    expect(screen.getByText('/health')).toBeInTheDocument();
  });
});
