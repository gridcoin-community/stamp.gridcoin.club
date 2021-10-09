import {
  TableCell, TableRow, LinearProgress,
} from '@mui/material';
import React from 'react';

interface Props {
  hash: string | undefined;
}

export function HashInfo({ hash }: Props) {
  return (
    <TableRow>
      <TableCell>
        <b>Hash</b>
      </TableCell>
      <TableCell align="right">
        {hash || <LinearProgress color="secondary" />}
      </TableCell>
    </TableRow>
  );
}
