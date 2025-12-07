'use client';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { getThemeFromCookie, toggleTheme } from '@/lib/mode';

export function ModeToggle() {
  const theme = useTheme();
  const colorMode = getThemeFromCookie();

  const toggleMode = () => {
    toggleTheme(colorMode);
    window.location.reload();
  };

  return (
    <Box>
      <IconButton
        sx={{ ml: 1 }}
        onClick={toggleMode}
        color="inherit"
      >
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
}
