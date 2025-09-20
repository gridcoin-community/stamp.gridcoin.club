import { styled } from '@mui/material/styles';
import React from 'react';
import { Box, IconButton } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import { useRouter } from 'next/router';
import { ModeToggle } from './Mode';
import { menuItems } from './constants';
import { NextMuiLink } from '../NextMuiLink';

const itemHorzPadding = 1;
const gutter = 2;

const Nav = styled('ul')(() => ({
  listStyle: 'none',
  display: 'flex',
  overflow: 'auto',
}));

const NavItem = styled('li')(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  borderRadius: 4,
  padding: theme.spacing(1, itemHorzPadding),
  cursor: 'pointer',
  textDecoration: 'none',
  transition: '0.2s ease-out',
  '& a': {
    color: theme.palette.text.secondary,
    textDecoration: 'none',
  },
  '&:after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    bottom: 0,
    left: theme.spacing(itemHorzPadding),
    width: `calc(100% - ${theme.spacing(itemHorzPadding * 2)})`,
    height: 3,
    transform: 'scale(0, 1)',
    transition: '0.2s ease-out',
    opacity: 0,
    borderRadius: 2,
    backgroundImage: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
  },
  '&:hover': {
    '& a': {
      color:
    theme.palette.mode === 'dark'
      ? theme.palette.primary.light
      : theme.palette.primary.main,
    },
    '&:after': {
      opacity: 1,
      transform: 'scale(1, 1)',
    },
  },
  '&:not(:first-of-type)': {
    marginLeft: typeof gutter === 'number' ? theme.spacing(gutter) : gutter,
  },
  '&.itemActive': {
    '& a': {
      color:
        theme.palette.mode === 'dark'
          ? theme.palette.primary.light
          : theme.palette.primary.main,
    },
    '&:after': {
      opacity: 1,
      transform: 'scale(1, 1)',
      backgroundColor:
          theme.palette.mode === 'dark'
            ? theme.palette.primary.light
            : theme.palette.primary.main,
    },
  },
}));

export function NavMenuDesktop() {
  const router = useRouter();

  return (
    <>
      <Box component="nav">
        <Nav>
          {Object.entries(menuItems).map(([uri, name]: [string, string]) => (
            <NavItem key={`dmenu-item-${uri.replace('/', '')}`} className={router.pathname === uri ? 'itemActive' : undefined}>
              <NextMuiLink href={uri}>{name}</NextMuiLink>
            </NavItem>
          ))}
        </Nav>
      </Box>
      <ModeToggle />
      <Box display="none">
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
                  // onClick={handleMenu}
          color="inherit"
        >
          <AppsIcon />
        </IconButton>
      </Box>
    </>
  );
}
