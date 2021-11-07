import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Image from 'next/image';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { NavMenuMobile } from 'components/Navigation/NavMenuMobile';
import { NavMenuDesktop } from '../Navigation/NavMenuDesktop';

interface Props {
  children: React.ReactElement;
}

export function ElevationScroll(props: Props) {
  const { children } = props;
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: { backgroundColor: trigger ? theme.palette.background.paper : 'transparent' },
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
            <Box>
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
            <Toolbar
              sx={{
                justifyContent: 'flex-end',
                flexGrow: 1,
              }}
              disableGutters
            >
              {isMobile ? <NavMenuMobile /> : <NavMenuDesktop />}
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </>
  );
}
