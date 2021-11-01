import {
  LinearProgress,
  ListItem,
  Typography,
  ListItemText,
  useTheme,
  Link,
  useMediaQuery,
} from '@mui/material';
import React from 'react';

interface Props {
  tx: string | undefined;
}

function TX({ tx }: Props) {
  return tx ? (
    <Link
      href={process.env.NEXT_PUBLIC_EXPLORER_TX_URL?.replace(/\[data\]/, tx)}
      target="_blank"
      rel="nofollow"
    >
      {tx}
    </Link>
  ) : (
    <LinearProgress color="secondary" />
  );
}

export function TXInfo({ tx }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = !isMobile;

  return (
    <ListItem disableGutters>
      <ListItemText
        primary={(<Typography variant="body1"><b>Tx ID</b></Typography>)}
        secondary={isMobile && <TX tx={tx} />}
      />
      {isDesktop && (
        <Typography variant="body2" textAlign="right" flexGrow={10}>
          <TX tx={tx} />
        </Typography>
      )}
    </ListItem>
  );
}
