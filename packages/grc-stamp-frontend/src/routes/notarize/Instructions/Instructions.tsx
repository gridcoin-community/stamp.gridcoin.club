import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StampIcon } from '@/icons/StampIcon';
import { GradientLine } from '@/components/GradientLine';
import { NextMuiLink } from '@/components/NextMuiLink';

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: theme.spacing(2),
}));

const TextBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(4),
  width: '128px',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export function Instructions() {
  return (
    <Wrapper>
      <IconWrapper>
        <StampIcon />
      </IconWrapper>
      <TextBox>
        <GradientLine />
        <Typography component="h1" variant="h4" sx={{ pb: 2 }}>
          Notarize documents with the Gridcoin blockchain
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Stamping a document on the Gridcoin blockchain creates a publicly
          verifiable record that it existed at a specific time. Any later edit,
          even a single bit, produces a different hash, so tampering shows up
          immediately.
          {' '}
          <NextMuiLink href="/about" passHref>More about how it works</NextMuiLink>
          .
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          To notarize a document or verify it later, drag and drop the file
          below.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          The service is free to use.
        </Typography>
      </TextBox>
    </Wrapper>
  );
}
