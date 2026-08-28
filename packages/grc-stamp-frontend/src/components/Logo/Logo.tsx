import { useId } from 'react';
import { useTheme } from '@mui/material/styles';

// The mark is inlined as React SVG so its gradient can be driven from
// `theme.palette.primary` rather than baked into a file: mainnet stays
// purple, testnet becomes orange, and any future palette swap follows the
// theme. The symbol is stamp's own — a seal with the check knocked out — not
// the Gridcoin G, which identified the network rather than this service.
//
// The wordmark beside it is live text in the header, not path data, so it
// renders in the site typeface and search engines can read it. The
// wordmark-as-outlines artwork still exists as public/ic-logo-desktop-*.svg,
// which the OG image and the certificate PDF need as a self-contained file. Mainnet stays purple, testnet becomes orange,
// any future palette swap follows the theme automatically.
//
// Two variants because the desktop and mobile artwork have different
// layouts (mark on the left vs. mark on the right) and slightly
// different wordmark path data — we'd lose layout fidelity trying to
// merge them, and the path bytes dominate the file size anyway.

function useLogoColors(role: 'primary' | 'secondary') {
  const theme = useTheme();
  const palette = theme.palette[role];
  return {
    main: palette.main,
    dark: palette.dark,
    light: palette.light,
  };
}



const MARK_DESKTOP_OUTER_D = 'm24.5901639 0 21.2957067 12.5v25l-21.2957067 12.5-21.29570662-12.5v-25z';
const MARK_DESKTOP_INNER_WHITE_D = 'm24.5901639 1.38888889 20.1126119 11.80555551v23.6111112l-20.1126119 11.8055555-20.1126118-11.8055555v-23.6111112z';
const MARK_DESKTOP_INNER_GRAD_D = 'm24.5901639 2.77777778 18.9295171 11.11111112v22.2222222l-18.9295171 11.1111111-18.92951699-11.1111111v-22.2222222z';
const MARK_SEAL_D = 'M24.59 11.7209L36.09 18.3605L36.09 31.6395L24.59 38.2791L13.09 31.6395L13.09 18.3605Z';
const MARK_SEAL_CHECK_D = 'M18.2 25.4l4.6 4.6 8.2-9.4';


// The mark on its own, for the header lockup. Siblings put a square logo next
// to a live-text wordmark; the desktop/mobile artwork below bakes the wordmark
// into path data, which renders in the wrong typeface here and is invisible to
// search engines. Those stay for the OG image and the certificate PDF, which
// need a self-contained file.
export function LogoMark({ size = 40, paletteRole = 'primary' }: { size?: number; paletteRole?: 'primary' | 'secondary' }) {
  const { dark, light } = useLogoColors(paletteRole);
  const gradId = `stamp-mark-${useId()}`;
  const url = `url(#${gradId})`;
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" role="img" aria-label="Gridcoin Stamp">
      <defs>
        <linearGradient id={gradId} x1="20.607143%" x2="98.374093%" y1="14.216759%" y2="100%">
          <stop offset="0" stopColor={dark} />
          <stop offset="1" stopColor={light} />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path d={MARK_DESKTOP_OUTER_D} fill={url} />
        <path d={MARK_DESKTOP_INNER_WHITE_D} fill="#fff" />
        <path d={MARK_DESKTOP_INNER_GRAD_D} fill={url} />
        <path d={MARK_SEAL_D} fill="#fff" />
        <path
          d={MARK_SEAL_CHECK_D}
          fill="none"
          stroke={url}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
