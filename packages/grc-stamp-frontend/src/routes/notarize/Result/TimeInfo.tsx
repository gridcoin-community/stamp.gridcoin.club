import {
  LinearProgress,
  ListItem,
  Typography,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import { format } from 'date-fns';

interface Props {
  time: number | undefined;
}

function Time({ time }: Props) {
  return time ? (
    <>{format(new Date(time * 1000), 'PPpp ')}</>
  ) : (
    <LinearProgress color="secondary" />
  );
}

export function TimeInfo({ time }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = !isMobile;

  return (
    <ListItem disableGutters>
      <ListItemText
        primary={(<Typography variant="body1"><b>Time</b></Typography>)}
        secondary={isMobile && <Time time={time} />}
      />
      {isDesktop && (
        <Typography variant="body2" textAlign="right" flexGrow={10}>
          <Time time={time} />
        </Typography>
      )}
    </ListItem>
  );
}
