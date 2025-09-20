import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { forwardRef } from 'react';

type NextMuiLinkProps = Omit<NextLinkProps, 'href'> &
MuiLinkProps & {
  href: NextLinkProps['href'];
};

// This component combines MUI's styling with Next.js routing
// eslint-disable-next-line react/display-name
export const NextMuiLink = forwardRef<HTMLAnchorElement, NextMuiLinkProps>(
  (props, ref) => {
    const {
      href,
      as,
      replace,
      scroll,
      shallow,
      prefetch,
      locale,
      ...muiProps
    } = props;

    return (
      <MuiLink
        component={NextLink}
        ref={ref}
        href={href}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        prefetch={prefetch}
        locale={locale}
        {...muiProps}
      />
    );
  },
);
