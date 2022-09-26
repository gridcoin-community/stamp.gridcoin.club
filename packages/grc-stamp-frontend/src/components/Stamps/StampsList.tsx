import React from 'react';
import { StampEntity } from 'entities/StampEntity';
import {
  Avatar,
  Box,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Identicon from 'identicon.js';
import { format } from 'date-fns';
import { blockUrl, txUrl } from 'lib/explorerLinks';

interface Props {
  stamps: StampEntity[];
}

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

export function StampsList({ stamps }: Props) {
  return (
    <Wrapper>
      <ListWrapper>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {stamps.map((stamp: StampEntity) => {
            const identiocon = (new Identicon(stamp.hash!, 40)).toString();
            return (
              <ListItem alignItems="flex-start" key={`stamp-${stamp.hash!}`}>
                <ListItemAvatar>
                  <Avatar
                    alt={stamp.hash}
                    src={`data:image/png;base64,${identiocon}`}
                  />
                </ListItemAvatar>
                <ListItemTextResponsive
                  primary={(
                    <>
                      <span>
                        Hash:
                        {' '}
                        {stamp.hash}
                      </span>
                      <br />
                      <span>
                        Tx:
                        {' '}
                        <Link
                          href={txUrl(stamp.tx)}
                          target="_blank"
                          rel="nofollow"
                        >
                          {stamp.tx}
                        </Link>
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
                        <Link
                          href={blockUrl(stamp.block)}
                          target="_blank"
                          rel="nofollow"
                        >
                          {stamp.block}
                        </Link>
                      </Typography>
                      <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
                        {` — ${format(new Date(stamp.time! * 1000), 'PPpp ')}`}
                      </Box>
                    </>
                    )}
                />
              </ListItem>
            );
          })}
        </List>
      </ListWrapper>
    </Wrapper>
  );
}
