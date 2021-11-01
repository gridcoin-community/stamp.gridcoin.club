import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { StampIcon } from 'icons/StampIcon';
import { useTheme, styled } from '@mui/material/styles';

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

function InstructionsComponent() {
  const theme = useTheme();
  const showIcon = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <>
      <Wrapper>
        {showIcon && (
          <Box mr={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <StampIcon />
          </Box>
        )}
        <TextBox>
          <Typography component="h1" variant="h4" mb={3}>
            Notarize documents with Gridcoin blockchain
          </Typography>
          <Typography variant="body1" gutterBottom>
            Timestamping of documents can allow a public verification of the issue history
            which is permanently recorded to the public blockchain.
            There is absolutely no method of potential malicious modification at a later stage.
          </Typography>
          <Typography variant="body1" gutterBottom>
            In order to notarize the document or check the proof of existence
            {' '}
            just drop the target file down below and follow the instructions.
          </Typography>
          <Typography variant="body1" gutterBottom>
            The service is provided free of charge.
          </Typography>
        </TextBox>
      </Wrapper>
    </>
  );
}

export const Instructions = React.memo(InstructionsComponent);
