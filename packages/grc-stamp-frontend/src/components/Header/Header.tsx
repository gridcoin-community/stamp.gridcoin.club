import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import LinearProgress from '@mui/material/LinearProgress';
import Image from 'next/image';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NavMenuMobile } from '@/components/Navigation/NavMenuMobile';
import { useRouteNavigating } from '@/hooks';
import { NavMenuDesktop } from '../Navigation/NavMenuDesktop';

interface Props {
  children: React.ReactElement;
}

export function ElevationScroll({ children }: Props) {
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

interface HeaderProps {
  // eslint-disable-next-line react/require-default-props
  showLinks?: boolean;
}

export function Header({ showLinks = true }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);
  const navigating = useRouteNavigating();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <ElevationScroll>
        <AppBar color="transparent">
          {navigating && (
            <LinearProgress
              color="primary"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                zIndex: (t) => t.zIndex.appBar + 1,
              }}
            />
          )}
          <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>
              <Link passHref href="/">
                {isMobile && mounted ? (
                  <Image
                    src="/ic-logo-mobile.svg"
                    width={140}
                    height={32}
                    alt="Gridcoin stamp"
                    priority
                  />
                ) : (
                  <Image
                    src="/ic-logo-desktop.svg"
                    width={158}
                    height={50}
                    alt="Gridcoin stamp"
                    priority
                  />
                )}
              </Link>
            </Box>

            <Toolbar
              sx={{
                justifyContent: 'flex-end',
                flexGrow: 1,
              }}
              disableGutters
            >
              {showLinks && (isMobile ? <NavMenuMobile /> : <NavMenuDesktop />)}
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </>
  );
}
