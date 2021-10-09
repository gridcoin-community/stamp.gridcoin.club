import {
  Container,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import { Balance } from 'components/Balance';
import React from 'react';

export function Footer() {
  return (
    <Container maxWidth="xl">
      <Divider />
      <Box sx={{ display: 'flex', mt: 4, mb: 4 }}>
        <Typography variant="caption">
          Made with ❤ by @gridcat
        </Typography>
        <Typography variant="caption" sx={{ flexGrow: 1, justifyContent: 'flex-end', display: 'flex' }}>
          <Balance />
        </Typography>
      </Box>
    </Container>
  );
}
