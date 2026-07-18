import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRouter } from 'next/router';
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
  // Must stay visible so the absolutely-positioned group dropdown can overflow
  // outside the nav instead of being clipped into a scroll box.
  overflow: 'visible',
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
  // The dropdown links stay in the DOM (rendered server-side, crawlable) and
  // are only shown on hover, keyboard focus, or an explicit click-toggle.
  '& .groupMenu': {
    display: 'none',
  },
  '&:hover .groupMenu, &:focus-within .groupMenu, &.groupOpen .groupMenu': {
    display: 'block',
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

const GroupMenu = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: theme.spacing(0.5, 0),
  position: 'absolute',
  top: '100%',
  right: 0,
  left: 'auto',
  minWidth: 200,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 4,
  boxShadow: theme.shadows[4],
  zIndex: theme.zIndex.appBar + 1,
  '& a': {
    display: 'block',
    padding: theme.spacing(1, 2),
    whiteSpace: 'nowrap',
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.primary.main,
    },
  },
}));

interface GroupItemProps {
  group: MenuGroup;
  isActive: boolean;
  entryKey: string;
}

function GroupItem({ group, isActive, entryKey }: GroupItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <NavItem
      key={entryKey}
      className={[isActive ? 'itemActive' : '', open ? 'groupOpen' : '']
        .filter(Boolean)
        .join(' ') || undefined}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="groupTrigger"
        onClick={() => setOpen((v) => !v)}
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
      <GroupMenu className="groupMenu">
        {group.children.map((child) => (
          <li key={child.href}>
            <NextMuiLink href={child.href} onClick={() => setOpen(false)}>
              {child.label}
            </NextMuiLink>
          </li>
        ))}
      </GroupMenu>
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
