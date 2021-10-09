import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#732DE2',
      light: '#953EF5',
      dark: '#621CD1',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'SF UI Text Regular',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

export default theme;
