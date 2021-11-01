import {
  LinearProgress,
  ListItem,
  Typography,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React from 'react';

interface Props {
  hash: string | undefined;
}

export function HashInfo({ hash }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = !isMobile;

  return (
    <ListItem disableGutters>
      <ListItemText
        primary={(<Typography variant="body1"><b>Hash</b></Typography>)}
        secondary={isMobile && (
          hash || <LinearProgress color="secondary" />
        )}
      />
      {isDesktop && (
        <Typography variant="body2" textAlign="right" flexGrow={10}>
          {hash || <LinearProgress color="secondary" />}
        </Typography>
      )}
    </ListItem>
  );
}
