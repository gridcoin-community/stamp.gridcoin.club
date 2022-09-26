import React from 'react';
import { Divider } from '@mui/material';
import { StampEntity } from 'entities/StampEntity';
import { format } from 'date-fns';
import { blockUrl, txUrl } from 'lib/explorerLinks';
import { Info } from './Info';

interface Props {
  stamp: StampEntity;
}

export function StampBlockchainData({ stamp }: Props) {
  return (
    <>
      <Info
        title="TX ID"
        value={stamp.tx}
        link={txUrl(stamp.tx)}
      />
      <Divider variant="fullWidth" component="li" />
      <Info
        title="Block"
        link={blockUrl(stamp.block)}
        value={stamp.block}
      />
      <Divider variant="fullWidth" component="li" />
      <Info
        title="Time"
        value={stamp.time && format(new Date(stamp.time * 1000), 'PPpp ')}
      />
    </>
  );
}
