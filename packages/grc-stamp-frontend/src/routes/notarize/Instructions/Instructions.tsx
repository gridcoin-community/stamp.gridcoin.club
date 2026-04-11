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
        <Typography component="h1" variant="h4" pb={2}>
          Notarize Documents with the Gridcoin Blockchain
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Timestamping your documents with the Gridcoin blockchain allows for a publicly
          verifiable record of their creation and history.
          This ensures that there is no possibility of malicious
          modifications being made at a later time. To learn more, click
          {' '}
          <NextMuiLink href="/about" passHref>here</NextMuiLink>
          .
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          To notarize a document or verify its existence,
          simply drag and drop the target file below and follow the provided instructions.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Our service is offered at no cost to you.
        </Typography>
      </TextBox>
    </Wrapper>
  );
}
