import {
  Container,
  Divider,
  Typography,
  Grid,
} from '@mui/material';
import GithubIcon from '@mui/icons-material/GitHub';
import React from 'react';
import { styled } from '@mui/material/styles';
import { Balance } from '@/components/Footer/Balance';

const SubFooterTypography = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  lineHeight: theme.spacing(8),
  width: '100%',
  display: 'inline-block',
  color: theme.palette.text.disabled,
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    lineHeight: theme.spacing(5),
  },
}));

const FooterTextTypography = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    textAlign: 'left',
  },
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
  },
}));

export function Footer() {
  return (
    <Container maxWidth="xl">
      <div>
        <Divider />
      </div>
      <Grid container spacing={0} mt={2} mb={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FooterTextTypography variant="caption">
            <Balance />
          </FooterTextTypography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FooterTextTypography variant="caption" textAlign="right">
            <a
              href="https://github.com/gridcoin-community/stamp.gridcoin.club"
              target="_blank"
              rel="nofollow noreferrer"
              style={{ display: 'inline-block' }}
            >
              <GithubIcon color="primary" sx={{ fontSize: 40 }} />
            </a>
          </FooterTextTypography>
        </Grid>
      </Grid>
      <Divider />
      <SubFooterTypography variant="caption">
        Made with
        {' '}
        <span style={{ color: 'red' }}>❤</span>
        {' '}
        by @gridcat
      </SubFooterTypography>
    </Container>
  );
}
