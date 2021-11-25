import { createTheme, responsiveFontSizes, lighten } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { PaletteMode, ThemeOptions } from '@mui/material';

// Create a theme instance.
const theme = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    primary: mode === 'light' ? {
      main: '#732DE2',
      light: '#953EF5',
      dark: '#4c1ea4',
    } : {
      main: lighten('#732DE2', 0.3),
      light: lighten('#953EF5', 0.3),
      dark: lighten('#4c1ea4', 0.3),
    },
    secondary: {
      main: '#e58842',
      light: '#f4b34a',
      dark: '#d6733c',
    },
    error: {
      main: red.A400,
    },
    mode,
  },
  typography: {
    fontFamily: [
      'SF UI Text Regular',
      '-apple-system',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: 50,
          textTransform: 'none',
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 10,
          paddingBottom: 10,
        },
        outlined: {
          borderWidth: 2,
          borderRadius: 50,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 10,
          paddingBottom: 10,
          textTransform: 'none',
          ':hover': {
            borderWidth: 2,
          },
        },
        text: {
          textTransform: 'none',
        },
        root: {
          '&.Mui-disabled': {
            borderWidth: 2,
          },
        },
      },
    },
  },
});

export const themeCreator = (mode: PaletteMode = 'light') => responsiveFontSizes(createTheme(theme(mode)));
