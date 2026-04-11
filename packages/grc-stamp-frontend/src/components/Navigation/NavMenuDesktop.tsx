import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import {
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ModeToggle } from './Mode';
import {
  menuItems,
  isMenuGroup,
  MenuEntry,
  MenuGroup,
} from './constants';
import { NextMuiLink } from '../NextMuiLink';

const itemHorzPadding = 1;
const gutter = 2;

const Nav = styled('ul')(() => ({
  listStyle: 'none',
  display: 'flex',
  overflow: 'auto',
  padding: 0,
  margin: 0,
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
  '& a, & .groupTrigger': {
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    font: 'inherit',
    cursor: 'pointer',
    padding: 0,
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
    '& a, & .groupTrigger': {
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
    marginLeft: theme.spacing(gutter),
  },
  '&.itemActive': {
    '& a, & .groupTrigger': {
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

interface GroupItemProps {
  group: MenuGroup;
  isActive: boolean;
  entryKey: string;
}

function GroupItem({ group, isActive, entryKey }: GroupItemProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <NavItem
      key={entryKey}
      className={isActive ? 'itemActive' : undefined}
    >
      <button
        type="button"
        className="groupTrigger"
        onClick={handleOpen}
        aria-haspopup="true"
        aria-expanded={open || undefined}
      >
        {group.label}
        <KeyboardArrowDownIcon
          fontSize="small"
          sx={{
            ml: 0.5,
            transition: '0.2s ease-out',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
          }}
        />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: { mt: 0.5, minWidth: 200 },
          },
        }}
      >
        {group.children.map((child) => (
          <MenuItem
            key={child.href}
            component={Link}
            href={child.href}
            onClick={handleClose}
          >
            {child.label}
          </MenuItem>
        ))}
      </Menu>
    </NavItem>
  );
}

function entryKeyFor(entry: MenuEntry, index: number): string {
  if (isMenuGroup(entry)) {
    return `dmenu-group-${entry.label.toLowerCase().replace(/\s+/g, '-')}-${index}`;
  }
  return `dmenu-item-${entry.href.replace('/', '') || 'root'}`;
}

export function NavMenuDesktop() {
  const router = useRouter();

  return (
    <>
      <Box component="nav">
        <Nav>
          {menuItems.map((entry, index) => {
            const key = entryKeyFor(entry, index);
            if (isMenuGroup(entry)) {
              const isActive = entry.children.some(
                (child) => router.pathname === child.href,
              );
              return (
                <GroupItem
                  key={key}
                  entryKey={key}
                  group={entry}
                  isActive={isActive}
                />
              );
            }
            const isActive = router.pathname === entry.href;
            return (
              <NavItem
                key={key}
                className={isActive ? 'itemActive' : undefined}
              >
                <NextMuiLink href={entry.href}>{entry.label}</NextMuiLink>
              </NavItem>
            );
          })}
        </Nav>
      </Box>
      <ModeToggle />
    </>
  );
}
