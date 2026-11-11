import {
  LinearProgress,
  ListItem,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { trackLinkPrivately } from '@/lib/track';
import { NextMuiLink } from '../NextMuiLink';

const ListItemTextResponsive = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-secondary': {
    textAlign: 'left',
    display: 'table',
    tableLayout: 'fixed',
    width: '100%',
    whiteSpace: 'nowrap',
  },
  '& .MuiListItemText-secondary > *': {
    display: 'table-cell',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  [theme.breakpoints.up('md')]: {
    '&.MuiListItemText-root': {
      flex: undefined,
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiListItemText-secondary': {
      width: '100%',
      textAlign: 'right',
      paddingLeft: theme.spacing(2),

    },
    '& .MuiListItemText-primary': {
      flexGrow: 1,
      whiteSpace: 'nowrap',
    },
  },
}));

interface Props {
  title: string,
   
  link?: string;
  value: string | number | undefined;
}

function SecondaryText({ title, value, link }: Props) {
  if (!value) {
    return (
      <LinearProgress color="secondary" />
    );
  }
  if (link) {
    return (
      <NextMuiLink
        href={link}
        target="_blank"
        rel="nofollow"
        {...trackLinkPrivately('Explorer Click', { item: title })}
      >
        {value}
      </NextMuiLink>
    );
  }
  return (<span>{value}</span>);
}

export function Info({ title, value, link }: Props) {
  return (
    <ListItem disableGutters>
      <ListItemTextResponsive
        primary={title}
        slotProps={{
          primary: { fontWeight: '600' },
        }}
        secondary={<SecondaryText title={title} value={value} link={link} />}
      />
    </ListItem>
  );
}
