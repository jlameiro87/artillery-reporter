import { render, screen } from '@testing-library/react';
import SummaryCards from '../components/SummaryCards';
import { ThemeProvider, createTheme } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

describe('SummaryCards', () => {
  const mockAggregate = {
    requests: 100,
    responses: 100,
    errors: 0,
    apdex: 1,
    throughput: 10,
    data: 1024 * 1024,
    sessionLength: 1000,
    latencyMean: 100,
    latencyP95: 200,
    latencyMax: 300,
  };

  it('renders all summary cards', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={createTheme()}>
          <SummaryCards aggregate={mockAggregate} />
        </ThemeProvider>
      </I18nextProvider>
    );
    expect(screen.getByText(/Total Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Responses/i)).toBeInTheDocument();
    expect(screen.getByText(/Errors/i)).toBeInTheDocument();
  });
});
