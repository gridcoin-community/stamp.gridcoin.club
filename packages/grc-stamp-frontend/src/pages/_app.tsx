import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import Script from 'next/script';
import { cleanupLegacyThemeCookie, ThemeMode } from '@/lib/mode';
import sseManager from '@/lib/sseManager';
import { IS_TESTNET, IS_MAINNET, NETWORK } from '@/lib/network';
import { SITE_URL } from '@/components/Seo';
import { themeCreator } from '../theme';
import createEmotionCache from '../createEmotionCache';
import '../styles/style.css';

// Plausible's data-domain is just the analytics bucket label. Derive it
// from the deployment's canonical URL so each environment's traffic
// segments correctly without a separate hardcoded mapping per network.
const PLAUSIBLE_DOMAIN = SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');

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

  React.useEffect(() => {
    cleanupLegacyThemeCookie();
    sseManager.connect(`${process.env.NEXT_PUBLIC_API_URL}/events`);
    return () => {
      sseManager.disconnect();
    };
  }, []);

  const theme = React.useMemo(
    () => themeCreator(mode, NETWORK),
    [mode],
  );

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        {IS_MAINNET && <meta httpEquiv="onion-location" content="http://u4embjw2uzwpdubgm72ywbmixte4kqgwurc4r4rp6elhlokutdfsy4id.onion" />}
        {IS_TESTNET && <meta name="robots" content="noindex,nofollow" />}
      </Head>
      {process.env.NEXT_PUBLIC_TRACK === 'true' && PLAUSIBLE_DOMAIN && (
        <Script
          src="https://daj.pw/js/plausible.js"
          data-domain={PLAUSIBLE_DOMAIN}
        />
      )}
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
