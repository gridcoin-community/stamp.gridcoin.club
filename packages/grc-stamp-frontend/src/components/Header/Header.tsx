import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Image from 'next/image';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import Box from '@mui/material/Box';
import { NavMenu } from '../Navigation/NavMenu';

interface Props {
  children: React.ReactElement;
}

export function ElevationScroll(props: Props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: { backgroundColor: trigger ? 'white' : 'transparent' },
  });
}

export function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <ElevationScroll>
        <AppBar color="transparent">
          <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ float: 'left' }}>
              {isMobile ? (
                <Image
                  src="/ic-logo-mobile.svg"
                  width={140}
                  height={32}
                  alt="Gridcoin stamp"
                />
              ) : (
                <Image
                  src="/ic-logo-desktop.svg"
                  width={158}
                  height={50}
                  alt="Gridcoin stamp"
                />
              )}
            </Box>
            <Toolbar sx={{
              justifyContent: 'flex-end',
              flexGrow: 1,
            }}
            >
              <NavMenu isVisible={false} />
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
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </>
  );
}
