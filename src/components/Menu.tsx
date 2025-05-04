import React from 'react';
import { IconButton, Menu as MuiMenu, MenuItem, ListItemIcon, ListItemText, Switch } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import BuildIcon from '@mui/icons-material/Build';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '../utility/common';

interface AppMenuProps {
  showConfig: boolean;
  setShowConfig: (v: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  language: string;
  comparisonMode: boolean;
  setComparisonMode: (v: boolean) => void;
}

const Menu: React.FC<AppMenuProps> = ({ showConfig, setShowConfig, darkMode, setDarkMode, comparisonMode, setComparisonMode }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage || i18n.language;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  // Use localStorage for menu preferences
  const [storedShowConfig, setStoredShowConfig] = useLocalStorage('menu_showConfig', showConfig);
  const [storedDarkMode, setStoredDarkMode] = useLocalStorage('menu_darkMode', darkMode);
  const [storedComparisonMode, setStoredComparisonMode] = useLocalStorage('menu_comparisonMode', comparisonMode);

  // Sync parent state with localStorage state
  React.useEffect(() => { setShowConfig(storedShowConfig); }, [storedShowConfig]);
  React.useEffect(() => { setDarkMode(storedDarkMode); }, [storedDarkMode]);
  React.useEffect(() => { setComparisonMode(storedComparisonMode); }, [storedComparisonMode]);

  return (
    <>
      <IconButton color="inherit" onClick={openMenu} size="large">
        <MenuIcon />
      </IconButton>
      <MuiMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={() => setStoredShowConfig(!storedShowConfig)}>
          <ListItemIcon><BuildIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{storedShowConfig ? t('config_on') : t('config_off')}</ListItemText>
          <Switch checked={storedShowConfig} onChange={() => setStoredShowConfig(!storedShowConfig)} color="primary" />
        </MenuItem>
        <MenuItem onClick={() => setStoredDarkMode(!storedDarkMode)}>
          <ListItemIcon><SettingsBrightnessIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{storedDarkMode ? t('dark') : t('light')}</ListItemText>
          <Switch checked={storedDarkMode} onChange={() => setStoredDarkMode(!storedDarkMode)} color="primary" />
        </MenuItem>
        <MenuItem onClick={() => setStoredComparisonMode(!storedComparisonMode)}>
          <ListItemIcon><BuildIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Comparison Mode</ListItemText>
          <Switch checked={storedComparisonMode} onChange={() => setStoredComparisonMode(!storedComparisonMode)} color="primary" />
        </MenuItem>
        <MenuItem disabled>
          <ListItemIcon><LanguageIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{currentLang === 'en' ? 'English' : currentLang === 'es' ? 'Español' : currentLang}</ListItemText>
        </MenuItem>
        {currentLang !== 'en' && (
          <MenuItem onClick={() => i18n.changeLanguage('en')}>EN</MenuItem>
        )}
        {currentLang !== 'es' && (
          <MenuItem onClick={() => i18n.changeLanguage('es')}>ES</MenuItem>
        )}
      </MuiMenu>
    </>
  );
};

export default Menu;
