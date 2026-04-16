import React, { useEffect, useState } from 'react';
import { Typography, Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StampEntity } from '@/entities/StampEntity';
import { StampRepository } from '@/repositories/StampsRepository';
import { useInterval, useSSEEvent } from '@/hooks';
import { StampsList } from './StampsList';
import { PendingCount } from './PendingCount';

const Wrapper = styled(Box)((() => ({
  display: 'flex',
  justifyContent: 'center',
})));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  width: theme.spacing(130),
  [theme.breakpoints.down('lg')]: {
    minWidth: theme.spacing(110),
  },
  [theme.breakpoints.down('md')]: {
    minWidth: 'auto',
    width: '100%',
  },
  justifySelf: 'center',
}));

const stampRepository = new StampRepository();

export function RecentStamps() {
  const [stamps, setStamps] = useState<StampEntity[] | null | undefined>(undefined);

  const fetchStamps = async () => {
    setStamps(await stampRepository.getRecentStamps());
  };

  useEffect(() => {
    fetchStamps();
  }, []);

  // Polling backstop for when SSE is unavailable (e.g. Cloudflare buffering
  // the /events stream). 30s keeps the list fresh without hammering the API.
  useInterval(() => {
    fetchStamps();
  }, 30_000);

  useSSEEvent('transactionFound', () => {
    // just refresh the list if a new stamp transaction in the block is found
    fetchStamps();
  });

  let stampsList;
  switch (stamps) {
    case undefined:
      stampsList = <LinearProgress color="secondary" />;
      break;
    case null:
       
      stampsList = <></>;
      break;
    default:
      stampsList = <StampsList stamps={stamps} />;
  }

  return (
    <>
      <Wrapper>
        <HeaderWrapper>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2,
          }}
          >
            <Typography component="h3" variant="h6">
              Most Recent Stamps
            </Typography>
            <PendingCount />
          </Box>
        </HeaderWrapper>
      </Wrapper>
      <Box>
        {stampsList}
      </Box>
    </>
  );
}
