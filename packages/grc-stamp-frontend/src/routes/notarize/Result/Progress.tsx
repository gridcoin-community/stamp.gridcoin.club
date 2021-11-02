import { Typography } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import { FileData } from '../reducer';

interface Props {
  fileData: FileData;
  isUploading: boolean;
}

const StyledProgress = styled(Typography)(({ theme }) => ({
  whiteSpace: 'nowrap',
  textAlign: 'left',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'right',
    paddingBottom: theme.spacing(1),
  },
}));

export function Progress({ fileData, isUploading }: Props) {
  if (!isUploading) {
    return null;
  }

  const transaction = fileData.blockchainData?.tx;
  const block = fileData.blockchainData?.block;
  const time = fileData.blockchainData?.time;
  const finished = transaction && block && time;

  let message = '';
  if (finished) {
    message = 'All done';
  } else if (!transaction && !block) {
    message = 'Submitting transaction...';
  } else if (!!transaction && !block) {
    message = 'Waiting for confirmations...';
  }

  return (
    <StyledProgress variant="body2">
      {message}
    </StyledProgress>
  );
}
