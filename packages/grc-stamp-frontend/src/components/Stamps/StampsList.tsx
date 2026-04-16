import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { TransitionGroup } from 'react-transition-group';
import { format } from 'date-fns';
import { blockUrl, txUrl } from '@/lib/explorerLinks';
import { identiconDataUrl } from '@/lib/identicon';
import { StampEntity } from '@/entities/StampEntity';
import { NextMuiLink } from '../NextMuiLink';

interface Props {
  stamps: StampEntity[];
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const Wrapper = styled(Box)((() => ({
  display: 'flex',
  justifyContent: 'center',
})));

const ListWrapper = styled(Box)(({ theme }) => ({
  width: theme.spacing(130),
  [theme.breakpoints.down('lg')]: {
    minWidth: theme.spacing(110),
  },
  [theme.breakpoints.down('md')]: {
    minWidth: 'auto',
    width: '100%',
  },
}));

const ListItemTextResponsive = styled(ListItemText)(() => ({
  '& .MuiListItemText-primary > *': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& .MuiListItemText-primary': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& .MuiListItemText-primary span': {
    display: 'inline',
    whiteSpace: 'nowrap',
  },
}));

const AnimatedListItem = styled(ListItem)({
  '&.stamp-new': {
    animation: `${fadeIn} 400ms ease-out 150ms both`,
  },
});

export function StampsList({ stamps }: Props) {
  const knownHashes = useRef<Set<string> | null>(null);
  const [newHashes, setNewHashes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentHashes = new Set(stamps.map((s) => s.hash ?? ''));

    // First load — mark all as known, skip animations
    if (knownHashes.current === null) {
      knownHashes.current = currentHashes;
      return undefined;
    }

    const fresh = new Set<string>();
    currentHashes.forEach((hash) => {
      if (!knownHashes.current!.has(hash)) {
        fresh.add(hash);
      }
    });

    knownHashes.current = currentHashes;

    if (fresh.size === 0) {
      return undefined;
    }

    setNewHashes(fresh);
    const timer = setTimeout(() => setNewHashes(new Set()), 600);
    return () => clearTimeout(timer);
  }, [stamps]);

  const hasNewItems = newHashes.size > 0;

  return (
    <Wrapper>
      <ListWrapper>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <TransitionGroup component={null}>
            {stamps.map((stamp: StampEntity) => {
              const hash = stamp.hash ?? '';
              const isNew = newHashes.has(hash);
              return (
                <Collapse
                  key={`stamp-${hash}`}
                  timeout={hasNewItems ? 400 : 0}
                  easing="ease-out"
                >
                  <AnimatedListItem
                    alignItems="flex-start"
                    className={isNew ? 'stamp-new' : undefined}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={hash}
                        src={identiconDataUrl(hash)}
                      />
                    </ListItemAvatar>
                    <ListItemTextResponsive
                      primary={(
                        <>
                          <span>
                            Hash:
                            {' '}
                            <NextMuiLink href={`/proof/${stamp.hash}`}>
                              {stamp.hash}
                            </NextMuiLink>
                          </span>
                          <br />
                          <span>
                            Tx:
                            {' '}
                            <NextMuiLink
                              href={txUrl(stamp.tx) || ''}
                              target="_blank"
                              rel="nofollow"
                            >
                              {stamp.tx}
                            </NextMuiLink>
                          </span>
                        </>
                      )}
                      secondary={(
                        <>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            In block
                            {' '}
                            <NextMuiLink
                              href={blockUrl(stamp.block) || ''}
                              target="_blank"
                              rel="nofollow"
                            >
                              {stamp.block}
                            </NextMuiLink>
                          </Typography>
                          <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
                            {` — ${format(new Date(stamp.time! * 1000), 'PPpp ')}`}
                          </Box>
                        </>
                      )}
                    />
                  </AnimatedListItem>
                </Collapse>
              );
            })}
          </TransitionGroup>
        </List>
      </ListWrapper>
    </Wrapper>
  );
}
