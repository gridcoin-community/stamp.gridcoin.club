import React, { useEffect, useState } from 'react';
import { Typography, Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StampEntity } from 'entities/StampEntity';
import { StampRepository } from 'repositories/StampsRepository';
import { StampsList } from './StampsList';

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

  let stampsList;
  switch (stamps) {
    case undefined:
      stampsList = <LinearProgress color="secondary" />;
      break;
    case null:
      // eslint-disable-next-line react/jsx-no-useless-fragment
      stampsList = <></>;
      break;
    default:
      stampsList = <StampsList stamps={stamps} />;
  }

  return (
    <>
      <Wrapper>
        <HeaderWrapper>
          <Typography component="h3" variant="h6" mb={2}>
            Most Recent Stamps
          </Typography>
        </HeaderWrapper>
      </Wrapper>
      <Box>
        {stampsList}
      </Box>
    </>
  );
}
