import { createTheme, responsiveFontSizes, lighten } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { PaletteMode, ThemeOptions } from '@mui/material';
import { Network } from '@/lib/network';

interface PaletteSpec {
  primary: { main: string; light: string; dark: string };
  secondary: { main: string; light: string; dark: string };
}

// Mainnet keeps stamp's signature purple. Testnet uses the family-wide
// orange so the user can spot a testnet tab without reading the chip
// (matches explorer's testnet palette verbatim).
const PALETTES: Record<Network, PaletteSpec> = {
  mainnet: {
    primary: { main: '#732DE2', light: '#953EF5', dark: '#4c1ea4' },
    secondary: { main: '#e58842', light: '#f4b34a', dark: '#d6733c' },
  },
  testnet: {
    primary: { main: '#ef6c00', light: '#ff9d3f', dark: '#b53d00' },
    secondary: { main: '#1976d2', light: '#5e92f3', dark: '#003c8f' },
  },
};

const theme = (mode: PaletteMode, network: Network): ThemeOptions => {
  const palette = PALETTES[network];
  const lift = mode === 'dark' ? 0.3 : 0;
  return {
    palette: {
      primary: mode === 'light' ? palette.primary : {
        main: lighten(palette.primary.main, lift),
        light: lighten(palette.primary.light, lift),
        dark: lighten(palette.primary.dark, lift),
      },
      secondary: palette.secondary,
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
  };
};

export const themeCreator = (
  mode: PaletteMode = 'light',
  network: Network = 'mainnet',
) => responsiveFontSizes(createTheme(theme(mode, network)));
