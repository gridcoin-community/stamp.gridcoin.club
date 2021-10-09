import {
  TableCell, TableRow, LinearProgress,
} from '@mui/material';
import React from 'react';
import { format } from 'date-fns';

interface Props {
  time: number | undefined;
}

export function TimeInfo({ time }: Props) {
  return (
    <TableRow>
      <TableCell>
        <b>Time</b>
      </TableCell>
      <TableCell align="right">
        {time
          ? (format(new Date(time * 1000), 'PPpp '))
          : <LinearProgress color="secondary" />}
      </TableCell>
    </TableRow>
  );
}
