import React, { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import {
  Container,
  Button,
  Dialog,
  Toolbar,
  Box,
  Stack,
  Divider,
  Typography,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { useRouteNavigating } from '@/hooks';
import {
  menuItems,
  isMenuGroup,
  MenuLeaf,
} from './constants';
import { ModeToggle } from './Mode';

const SubMenuContainer = styled(Container)(() => ({
  alignItems: 'center',
  display: 'flex',
}));

const MenuContainer = styled(Container)(() => ({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  height: '100%',
}));

const MenuButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  fontWeight: 600,
}));

const ChildButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  fontWeight: 500,
  textTransform: 'none',
}));

interface LeafLinkProps {
  leaf: MenuLeaf;
  currentPath: string;
  ButtonComponent: typeof MenuButton;
}

function LeafLink({
  leaf,
  currentPath,
  ButtonComponent,
}: LeafLinkProps) {
  const isCurrent = currentPath === leaf.href;
  return (
    <Link href={leaf.href} style={{ textDecoration: 'none' }}>
      <ButtonComponent
        variant={isCurrent ? 'contained' : 'text'}
        disableElevation
        color="primary"
      >
        {leaf.label}
      </ButtonComponent>
    </Link>
  );
}

export function NavMenuMobile() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const navigating = useRouteNavigating();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Drawer doubles as a loading screen while the next page streams in —
  // close it once the router reports the transition is done. Deps are
  // intentionally just [navigating] so the effect stays dormant while the
  // user is opening/closing the drawer manually.
  useEffect(() => {
    if (!navigating) {
      setOpen(false);
    }
  }, [navigating]);

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleClickOpen}
      >
        <MenuIcon />
      </IconButton>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
      >
        {navigating && (
          <LinearProgress
            color="primary"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
            }}
          />
        )}
        <SubMenuContainer>
          <Box>
            <Image
              src="/ic-logo-mobile.svg"
              width={140}
              height={32}
              alt="Gridcoin stamp"
            />
          </Box>
          <Toolbar
            sx={{
              justifyContent: 'flex-end',
              flexGrow: 1,
            }}
            disableGutters
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </SubMenuContainer>
        <MenuContainer>
          <Stack spacing={1} sx={{ alignItems: 'center' }}>
            {menuItems.map((entry) => {
              if (isMenuGroup(entry)) {
                return (
                  <Box
                    key={`mmenu-group-${entry.label}`}
                    sx={{ pt: 2, textAlign: 'center' }}
                  >
                    <Typography
                      variant="overline"
                      sx={{
                        display: 'block',
                        color: 'text.secondary',
                        letterSpacing: '0.12em',
                        mb: 0.5,
                      }}
                    >
                      {entry.label}
                    </Typography>
                    <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
                      {entry.children.map((child) => (
                        <LeafLink
                          key={child.href}
                          leaf={child}
                          currentPath={router.pathname}
                          ButtonComponent={ChildButton}
                        />
                      ))}
                    </Stack>
                  </Box>
                );
              }
              return (
                <Box
                  key={`mmenu-item-${entry.href.replace('/', '') || 'root'}`}
                >
                  <LeafLink
                    leaf={entry}
                    currentPath={router.pathname}
                    ButtonComponent={MenuButton}
                  />
                </Box>
              );
            })}
          </Stack>
        </MenuContainer>
        <Divider />
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <ModeToggle />
        </Toolbar>
      </Dialog>
    </>
  );
}
