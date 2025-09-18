import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import Script from 'next/script';
import { themeCreator } from '../theme';
import createEmotionCache from '../createEmotionCache';
import { ColorModeContext } from '../context';
import '../styles/style.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache: EmotionCache | undefined;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const storedMode = localStorage.getItem('mode');
    if (storedMode && ['light', 'dark'].includes(storedMode)) {
      setMode(storedMode as 'light' | 'dark');
    }
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      localStorage.setItem('mode', mode);
    }
  }, [mode, isMounted]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () => themeCreator(mode),
    [mode],
  );

  if (!isMounted) {
    return null;
  }

  return (
    <CacheProvider value={emotionCache}>
      <ColorModeContext.Provider value={colorMode}>
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta httpEquiv="onion-location" content="http://u4embjw2uzwpdubgm72ywbmixte4kqgwurc4r4rp6elhlokutdfsy4id.onion" />
        </Head>
        {process.env.NEXT_PUBLIC_TRACK === 'true' && (
          <Script src="https://daj.pw/js/plausible.js" data-domain="stamp.gridcoin.club" />
        )}
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}
