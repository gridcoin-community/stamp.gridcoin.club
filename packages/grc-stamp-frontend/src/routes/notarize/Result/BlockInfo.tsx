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
  block: number | undefined;
}

function Block({ block }: Props) {
  return block ? (
    <Link
      href={process.env.NEXT_PUBLIC_EXPLORER_BLOCK_URL?.replace(/\[data\]/, String(block))}
      target="_blank"
      rel="nofollow"
    >
      {block}
    </Link>
  ) : (
    <LinearProgress color="secondary" />
  );
}

export function BlockInfo({ block }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = !isMobile;

  return (
    <ListItem disableGutters>
      <ListItemText
        primary={(<Typography variant="body1"><b>Block</b></Typography>)}
        secondary={isMobile && <Block block={block} />}
      />
      {isDesktop && (
        <Typography variant="body2" textAlign="right" flexGrow={10}>
          <Block block={block} />
        </Typography>
      )}
    </ListItem>
  );
}
