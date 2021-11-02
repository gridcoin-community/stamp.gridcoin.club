import {
  LinearProgress,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const ListItemTextResponsive = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-secondary': {
    textAlign: 'left',
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
  // eslint-disable-next-line react/require-default-props
  link?: string;
  value: string | number | undefined;
}

function SecondaryText({ value, link }: Omit<Props, 'title'>) {
  if (!value) {
    return (
      <LinearProgress color="secondary" />
    );
  }
  if (link) {
    return (
      <Link
        href={link}
        target="_blank"
        rel="nofollow"
      >
        {value}
      </Link>
    );
  }
  return (<>{value}</>);
}

export function Info({ title, value, link }: Props) {
  return (
    <ListItem disableGutters>
      <ListItemTextResponsive
        primary={title}
        primaryTypographyProps={{
          fontWeight: '600',
        }}
        secondary={<SecondaryText value={value} link={link} />}
      />
    </ListItem>
  );
}
