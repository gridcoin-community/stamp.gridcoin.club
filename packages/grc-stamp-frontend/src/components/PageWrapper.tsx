import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(2),
  },
}));
