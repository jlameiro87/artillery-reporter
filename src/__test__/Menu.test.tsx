import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu from '../components/Menu';
import { ThemeProvider, createTheme } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

describe('Menu', () => {
  it('renders menu button', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={createTheme()}>
          <Menu showConfig={true} setShowConfig={() => {}} darkMode={true} setDarkMode={() => {}} language="en" comparisonMode={false} setComparisonMode={() => {}} />
        </ThemeProvider>
      </I18nextProvider>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows language label for English', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={createTheme()}>
          <Menu showConfig={true} setShowConfig={() => {}} darkMode={true} setDarkMode={() => {}} language="en" comparisonMode={false} setComparisonMode={() => {}} />
        </ThemeProvider>
      </I18nextProvider>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/English/)).toBeInTheDocument();
  });

  it('shows language switch option for Spanish', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={createTheme()}>
          <Menu showConfig={true} setShowConfig={() => {}} darkMode={true} setDarkMode={() => {}} language="es" comparisonMode={false} setComparisonMode={() => {}} />
        </ThemeProvider>
      </I18nextProvider>
    );
    await userEvent.click(screen.getByRole('button'));
    // The menu shows 'ES' as the switch option, not 'Español' as the label
    expect(screen.getByText(/^ES$/)).toBeInTheDocument();
  });
});
