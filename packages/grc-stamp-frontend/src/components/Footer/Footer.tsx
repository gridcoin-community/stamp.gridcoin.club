import {
  Container,
  Divider,
  Typography,
  Grid,
  Toolbar,
  Box,
} from '@mui/material';
import { Balance } from 'components/Footer/Balance';
import GithubIcon from '@mui/icons-material/GitHub';
import Link from 'next/link';
import React from 'react';

export function Footer() {
  return (
    <Container maxWidth="xl">
      <Divider />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="caption">
              Made with
              {' '}
              <span style={{ color: 'red' }}>❤</span>
              {' '}
              by @gridcat
            </Typography>
          </Box>
          <Typography variant="caption">
            <Link href="https://github.com/gridcat/grc-stamp-frontend" passHref>
              <a target="_blank" rel="nofollow">
                <GithubIcon color="action" />
              </a>
            </Link>
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
