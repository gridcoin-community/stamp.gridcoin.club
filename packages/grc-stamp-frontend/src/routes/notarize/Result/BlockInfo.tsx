import {
  TableCell, TableRow, Link, LinearProgress,
} from '@mui/material';
import React from 'react';

interface Props {
  block: number | undefined;
}

export function BlockInfo({ block }: Props) {
  const url = block
    ? process.env.NEXT_PUBLIC_EXPLORER_BLOCK_URL?.replace(/\[data\]/, String(block))
    : '';

  return (
    <TableRow>
      <TableCell>
        <b>Block</b>
      </TableCell>
      <TableCell align="right">
        {block ? (
          <Link href={url} target="_blank">{block}</Link>
        ) : (
          <LinearProgress color="secondary" />
        )}
      </TableCell>
    </TableRow>
  );
}
