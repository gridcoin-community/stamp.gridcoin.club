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
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

function InstructionsComponent() {
  return (
    <>
      <Wrapper>
        <IconWrapper>
          <StampIcon />
        </IconWrapper>
        <TextBox>
          <GradientLine />
          <Typography component="h1" variant="h4" mb={3}>
            Notarize documents with Gridcoin blockchain
          </Typography>
          <Text variant="body1" gutterBottom>
            Timestamping of documents can allow a public verification of the issue history
            which is permanently recorded to the public blockchain.
            There is absolutely no way of potential malicious modification at a later stage.
            Learn more
            {' '}
            <Link href="/about" passHref>
              <MLink>here</MLink>
            </Link>
            .
          </Text>
          <Text variant="body1" gutterBottom>
            In order to notarize the document or check the proof of existence
            {' '}
            just drop the target file down below and follow the instructions.
          </Text>
          <Text variant="body1" gutterBottom>
            The service is provided free of charge.
          </Text>
        </TextBox>
      </Wrapper>
    </>
  );
}

export const Instructions = React.memo(InstructionsComponent);
