import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import LinearProgress from '@mui/material/LinearProgress';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NavMenuMobile } from '@/components/Navigation/NavMenuMobile';
import { useRouteNavigating } from '@/hooks';
import { IS_TESTNET } from '@/lib/network';
import { BackfillBanner } from '@/components/BackfillBanner';
import { LowFundsBanner } from '@/components/LowFundsBanner';
import { LogoDesktop, LogoMobile } from '@/components/Logo';
import { NavMenuDesktop } from '../Navigation/NavMenuDesktop';

interface Props {
  children: React.ReactElement<React.ComponentProps<typeof AppBar>>;
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
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
                {isMobile && mounted ? <LogoMobile /> : <LogoDesktop />}
              </Link>
              {IS_TESTNET && (
                <Box
                  component="span"
                  sx={{
                    px: 1,
                    py: 0.25,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: 1.4,
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: 1,
                    lineHeight: 1.2,
                  }}
                >
                  TESTNET
                </Box>
              )}
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
      <LowFundsBanner />
      <BackfillBanner />
    </>
  );
}
