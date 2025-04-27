import { render, screen, fireEvent } from '@testing-library/react';
import ConfigDesigner from '../components/ConfigDesigner';
import { ThemeProvider, createTheme } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

describe('ConfigDesigner', () => {
  it('renders config designer UI', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={createTheme()}>
          <ConfigDesigner />
        </ThemeProvider>
      </I18nextProvider>
    );
    expect(screen.getByText(/Design Config/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target URL/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Phases/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Plugins/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/YAML Output/i)).toBeInTheDocument();
  });

  it('can add a phase', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={createTheme()}>
          <ConfigDesigner />
        </ThemeProvider>
      </I18nextProvider>
    );
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Arrival Rate/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Ramp To/i), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Phase 1' } });
    fireEvent.click(screen.getByText(/Add Phase/i));
    expect(screen.getAllByText(/Phase 1/i).length).toBeGreaterThan(0);
  });
});
