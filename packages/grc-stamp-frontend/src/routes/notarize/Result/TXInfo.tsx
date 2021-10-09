import {
  TableCell, TableRow, Link, LinearProgress,
} from '@mui/material';
import React from 'react';

interface Props {
  tx: string | undefined;
}

export function TXInfo({ tx }: Props) {
  const url = tx
    ? process.env.EXPLORER_TX_URL?.replace(/\[data\]/, tx)
    : '';

  return (
    <TableRow>
      <TableCell>
        <b>Transaction ID</b>
      </TableCell>
      <TableCell align="right">
        {tx ? (
          <Link href={url} target="_blank">{tx}</Link>
        ) : (
          <LinearProgress color="secondary" />
        )}
      </TableCell>
    </TableRow>
  );
}
