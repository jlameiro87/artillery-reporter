import React from 'react';
import { IconButton, Menu as MuiMenu, MenuItem, ListItemIcon, ListItemText, Switch } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import BuildIcon from '@mui/icons-material/Build';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

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

  return (
    <>
      <IconButton color="inherit" onClick={openMenu} size="large">
        <MenuIcon />
      </IconButton>
      <MuiMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={() => setShowConfig(!showConfig)}>
          <ListItemIcon><BuildIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{showConfig ? t('config_on') : t('config_off')}</ListItemText>
          <Switch checked={showConfig} onChange={() => setShowConfig(!showConfig)} color="primary" />
        </MenuItem>
        <MenuItem onClick={() => setDarkMode(!darkMode)}>
          <ListItemIcon><SettingsBrightnessIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{darkMode ? t('dark') : t('light')}</ListItemText>
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} color="primary" />
        </MenuItem>
        <MenuItem onClick={() => setComparisonMode(!comparisonMode)}>
          <ListItemIcon><BuildIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Comparison Mode</ListItemText>
          <Switch checked={comparisonMode} onChange={() => setComparisonMode(!comparisonMode)} color="primary" />
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
