import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import Script from 'next/script';
// import sseManager from '@/lib/sseManager';
import { themeCreator } from '../theme';
import createEmotionCache from '../createEmotionCache';
import '../styles/style.css';
import { ThemeMode } from '@/lib/mode';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache: EmotionCache | undefined;
  mode: ThemeMode;
}

export default function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  } = props;
  const { mode } = pageProps;

  // console.log('App mode:', mode);
  // React.useEffect(() => {
  //   if (isMounted && typeof window !== 'undefined') {
  //     console.log('Connecting to SSE...');
  //     sseManager.connect(`${process.env.NEXT_PUBLIC_API_URL}/events`);
  //   }
  //   return () => sseManager.disconnect();
  // }, [isMounted]);

  const theme = React.useMemo(
    () => themeCreator(mode),
    [mode],
  );

  // if (!isMounted) {
  //   return null;
  // }

  return (
    <CacheProvider value={emotionCache}>
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
    </CacheProvider>
  );
}
