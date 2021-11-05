import { styled } from '@mui/material/styles';
import React from 'react';
import Link from 'next/link';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';

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
  '&:not(:first-child)': {
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

export function NavMenu() {
  const router = useRouter();

  return (
    <Box component="nav">
      <Nav>
        <NavItem className={router.pathname === '/' ? 'itemActive' : undefined}>
          <Link href="/">
            <a>Stamp</a>
          </Link>
        </NavItem>
        <NavItem className={router.pathname === '/about' ? 'itemActive' : undefined}>
          <Link href="/about">
            <a>About</a>
          </Link>
        </NavItem>
        <NavItem className={router.pathname === '/api' ? 'itemActive' : undefined}>
          <Link href="/api">
            <a>API</a>
          </Link>
        </NavItem>
      </Nav>
    </Box>
  );
}
