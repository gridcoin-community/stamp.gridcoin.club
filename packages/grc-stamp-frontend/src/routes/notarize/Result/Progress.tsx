import { Typography } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import { StampEntity } from '@/entities/StampEntity';
import { FileData } from '../reducer';
import { NextMuiLink } from '@/components/NextMuiLink';

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
  const stamp = new StampEntity(fileData.blockchainData);
  stamp.hash = fileData.hash;

  let message;
  if (stamp.isFinished()) {
    message = (
      <span>
        All Done.
        {' '}
        <NextMuiLink passHref href={`/proof/${stamp.hash}`}>
          Permalink to the proof.
        </NextMuiLink>
      </span>
    );
  } else if (!stamp.tx && !stamp.block) {
    message = <span>Submitting transaction...</span>;
  } else if (!!stamp.tx && !stamp.block) {
    message = <span>Waiting for confirmations...</span>;
  }

  return (
    <StyledProgress variant="body2">
      {message}
    </StyledProgress>
  );
}
