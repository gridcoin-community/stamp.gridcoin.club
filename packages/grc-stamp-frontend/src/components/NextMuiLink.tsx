import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import Link, { LinkProps as NextLinkProps } from 'next/link';
import { forwardRef } from 'react';

type NextMuiLinkProps = NextLinkProps & Omit<MuiLinkProps, 'href'>;

// eslint-disable-next-line react/display-name
export const NextMuiLink = forwardRef<HTMLAnchorElement, NextMuiLinkProps>(
  (props, ref) => {
    const {
      as, href, replace, scroll, shallow, prefetch, locale, ...muiProps
    } = props;

    return (
      <Link
        href={href}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        prefetch={prefetch}
        locale={locale}
        passHref
        legacyBehavior // important for MUI Link to get proper anchor props
      >
        <MuiLink ref={ref} {...muiProps} />
      </Link>
    );
  },
);
