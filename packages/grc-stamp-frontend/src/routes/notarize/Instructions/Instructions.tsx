import React from 'react';
import { Box, Typography } from '@mui/material';
import { StampIcon } from 'icons/StampIcon';
import { styled } from '@mui/material/styles';
import MLink from '@mui/material/Link';
import Link from 'next/link';
import { GradientLine } from 'components/GradientLine';

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

const Text = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    textAlign: 'justify',
  },
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

function InstructionsComponent() {
  return (
    <Wrapper>
      <IconWrapper>
        <StampIcon />
      </IconWrapper>
      <TextBox>
        <GradientLine />
        <Typography component="h1" variant="h4" mb={3}>
          Notarize Documents with the Gridcoin Blockchain
        </Typography>
        <Text variant="body1" gutterBottom>
          Timestamping your documents with the Gridcoin blockchain allows for a publicly
          verifiable record of their creation and history.
          This ensures that there is no possibility of malicious
          modifications being made at a later time. To learn more, click
          {' '}
          <Link href="/about" passHref>
            <MLink>here</MLink>
          </Link>
          .
        </Text>
        <Text variant="body1" gutterBottom>
          To notarize a document or verify its existence,
          simply drag and drop the target file below and follow the provided instructions.
        </Text>
        <Text variant="body1" gutterBottom>
          Our service is offered at no cost to you.
        </Text>
      </TextBox>
    </Wrapper>
  );
}

export const Instructions = React.memo(InstructionsComponent);
