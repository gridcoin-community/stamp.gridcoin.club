'use server';

import * as React from 'react';
import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
// import { cookies } from 'next/headers';
import { parseCookie } from 'cookie';
import createEmotionCache from '../createEmotionCache';
import { DEFAULT_THEME, ThemeMode } from '@/lib/mode';
// import { DEFAULT_THEME, ThemeMode } from '@/lib/mode';

export default class MyDocument extends Document {
  render() {
    const { theme } = this.props as any;
    return (
      <Html
        lang="en"
        data-theme={theme}
        data-scroll-behavior="smooth"
      >
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between
  // all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () => originalRenderPage({
    // eslint-disable-next-line react/display-name
    enhanceApp: (App: any) => (props) => <App emotionCache={cache} {...props} />,
  });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  const { req } = ctx;
  let theme: ThemeMode = DEFAULT_THEME;
  if (req) {
    const cookies = req.headers.cookie ? parseCookie(req.headers.cookie) : {};
    const themeCookie = cookies.theme;
    theme = themeCookie === 'light' || themeCookie === 'dark'
      ? (themeCookie as ThemeMode)
      : DEFAULT_THEME;
  }

  // const cookieStore = await cookies();
  // const theme: ThemeMode = cookieStore.get('theme') || DEFAULT_THEME;
  // if (1) {
  //   console.log(req);
  // }
  // if (req?.headers?.cookie) {
  //   console.log(req.headers.cookie);
  //   const match = req.headers.cookie.match(/theme=(dark|light)/);
  //   console.log(match);
  //   if (match) theme = match[1] as ThemeMode;
  // }

  return {
    ...initialProps,
    theme,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
  };
};
