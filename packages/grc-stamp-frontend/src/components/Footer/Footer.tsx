import {
  Container,
  Divider,
  Typography,
  Grid,
  Toolbar,
} from '@mui/material';
import { Balance } from 'components/Footer/Balance';
import React from 'react';

export function Footer() {
  return (
    <Container maxWidth="xl">
      <Divider />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="caption">
            Made with
            {' '}
            <span style={{ color: 'red' }}>❤</span>
            {' '}
            by @gridcat
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="caption" sx={{ textAlign: 'right' }}>
            <Balance />
          </Typography>
        </Grid>
      </Grid>
      <Toolbar />
    </Container>
  );
}
