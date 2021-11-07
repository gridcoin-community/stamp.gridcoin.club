import React, { useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { menuItems } from './constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { ModeToggle } from './Mode';

const SubMenuContainer = styled(Container)(() => ({
  alignItems: 'center',
  display: 'flex',
}))

const MenuContainer = styled(Container)(() => ({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  height: '100%' ,
}));

const MenuButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  fontWeight: 600,
}))

export function NavMenuMobile() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        <SubMenuContainer>
          <Box>
            <Image
              src="/ic-logo-mobile.svg"
              width={140}
              height={32}
              alt="Gridcoin stamp"
            />
          </Box>
          <Toolbar sx={{
            justifyContent: 'flex-end',
            flexGrow: 1,
          }} disableGutters>
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
          <Stack alignItems="center">
          {Object.entries(menuItems).map(([uri, name]: [string, string]) => {
            const isCurrent = router.pathname === uri; 
            return (
              <Box key={`mmenu-item-${uri.replace('/', '')}`} p={3}>
                <Link href={uri} passHref>
                  <MenuButton
                    variant={isCurrent ? 'contained' : 'text'}
                    disableElevation
                    color={isCurrent ? 'primary' : 'inherit'}
                  >{name}</MenuButton>
                </Link>
              </Box>
            )
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
