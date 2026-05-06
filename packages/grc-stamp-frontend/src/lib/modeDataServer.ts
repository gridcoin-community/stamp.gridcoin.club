'use server';

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookie } from 'cookie';
import axios from 'axios';
import yayson from 'yayson';
import { WalletRawData } from '@/entities/WalletEntity';
import { IndexerStatusEvent } from '@/types';
import { DEFAULT_THEME, ThemeMode } from './mode';

const { Store } = yayson();

// SSR-only base URL — points to the in-cluster service name (e.g.
// http://grc_stamp:7000) rather than the public-facing one. Falls back
// to NEXT_PUBLIC_API_URL during local dev where the two coincide.
const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL_SERVER
  ?? process.env.NEXT_PUBLIC_API_URL;

// Tight timeout — the footer/banner are nice-to-have prefills, not the
// page's reason to exist. If the stamp API is slow we'd rather render
// without prefill than block the whole page render.
const SSR_FETCH_TIMEOUT_MS = 1500;

async function fetchPrefill<T>(path: string): Promise<T | null> {
  if (!SERVER_API_URL) return null;
  try {
    const store = new Store();
    const { data: result } = await axios.get(`${SERVER_API_URL}${path}`, {
      timeout: SSR_FETCH_TIMEOUT_MS,
    });
    return result ? (store.sync(result) as T | null) ?? null : null;
  } catch {
    return null;
  }
}

export interface CommonPageProps {
  mode: ThemeMode;
  initialWallet: WalletRawData | null;
  initialIndexerStatus: IndexerStatusEvent['data'] | null;
}

export function withThemeDataServerSide<T extends Record<string, any>>(
  gssp?: GetServerSideProps<T>,
): GetServerSideProps<T & CommonPageProps> {
  return async (
    context: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<T & CommonPageProps>> => {
    const { req } = context;
    const cookies = req.headers.cookie ? parseCookie(req.headers.cookie) : {};
    const themeCookie = cookies.theme;
    const theme: ThemeMode = themeCookie === 'light' || themeCookie === 'dark'
      ? (themeCookie as ThemeMode)
      : DEFAULT_THEME;

    const [pageResult, initialWallet, initialIndexerStatus] = await Promise.all([
      gssp ? gssp(context) : Promise.resolve(null),
      fetchPrefill<WalletRawData>('/wallet'),
      fetchPrefill<IndexerStatusEvent['data']>('/indexer/status'),
    ]);

    let pageProps: T = {} as T;
    if (pageResult) {
      if ('props' in pageResult) {
        pageProps = pageResult.props as T;
      } else {
        // If page returns redirect or notFound
        return pageResult as any;
      }
    }

    return {
      props: {
        ...pageProps,
        mode: theme,
        initialWallet,
        initialIndexerStatus,
      },
    };
  };
}
