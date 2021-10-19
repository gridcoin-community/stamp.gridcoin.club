import { Typography } from '@mui/material';
import React from 'react';
import { FileData } from '../reducer';

interface Props {
  fileData: FileData;
  isUploading: boolean;
}

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
    message = 'Waiting for the confirmations...';
  }

  return (
    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
      {message}
    </Typography>
  );
}
