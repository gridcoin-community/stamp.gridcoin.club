import React, { useEffect, useState } from 'react';
import { NextMuiLink } from '@/components/NextMuiLink';

interface ObfuscatedEmailProps {
  user: string;
  domain: string;
  color?: string;
}

// Renders a contact email without putting the plain address in the server
// HTML. The user and domain arrive as separate props and are only joined in
// the browser, so mass-market harvesters (which scrape raw HTML and don't run
// JS) never see a `user@domain` string or a `mailto:` link. Readers without
// JavaScript still get a human-readable, munged fallback so the legal
// service-of-process address stays reachable.
export function ObfuscatedEmail({ user, domain, color = 'primary' }: ObfuscatedEmailProps) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    setAddress(`${user}@${domain}`);
  }, [user, domain]);

  // SSR and the first client render both hit this branch (address is null),
  // so there's no hydration mismatch; the mailto link swaps in after mount.
  if (!address) {
    return (
      <span>
        {user}
        {' [at] '}
        {domain.replace(/\./g, ' [dot] ')}
      </span>
    );
  }

  return (
    <NextMuiLink href={`mailto:${address}`} color={color}>
      {address}
    </NextMuiLink>
  );
}
