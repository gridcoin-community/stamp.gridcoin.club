import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import Box from '@mui/material/Box';

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
  });
}

export function Header() {
  return (
    <>
      <ElevationScroll>
        <AppBar color="transparent" sx={{ backgroundColor: '#f8fafd' }}>
          <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ float: 'left' }}>
              <Image
                src="/ic-logo-desktop.svg"
                width={158}
                height={50}
                alt="Gridcoin stamp"
              />
            </Box>
            <Toolbar sx={{
              justifyContent: 'flex-end',
              flexGrow: 1,
            }}
            >
              <div>
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
              </div>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <Toolbar />
    </>
  );
}
