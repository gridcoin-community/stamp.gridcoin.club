import { Typography, Box } from '@mui/material';
import React from 'react';
import { NextMuiLink } from '@/components/NextMuiLink';

export function Privacy() {
  return (
    <Box id="privacy" sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Privacy and personal data
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          The Service stores the bare minimum needed to operate.
          For each stamp: the hash, hash type, protocol version,
          transaction id, block, raw transaction, and the time
          values that surround it. Nothing about you. There are no
          accounts, no email addresses, no real names.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Operational logs (IP address, user-agent, request timing)
          are retained on a rolling window for security and capacity
          planning, then deleted. Aggregate page-view counts come
          from
          {' '}
          <NextMuiLink href="https://plausible.io/" rel="external nofollow noopener" color="primary">Plausible</NextMuiLink>
          , which does not set tracking cookies and does not follow
          you across sites.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>About the on-chain hash.</b>
          {' '}
          Hashes published on the Gridcoin chain are public,
          immutable, and not under the operator&apos;s control. The
          operator cannot retrieve, redact, or remove them. If you
          do not want a hash to be public forever, do not stamp it.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>Hashes of personal data.</b>
          {' '}
          Under the European Data Protection Board&apos;s Guidelines
          02/2025 on processing personal data through blockchain
          technologies, a hash derived from personal data may itself
          retain personal-data status. The Service has no way to tell
          whether the hash you submit derives from personal data; that
          determination, and any lawful basis for processing it under
          GDPR or similar regimes, is your responsibility. If you are
          unsure, do not stamp the hash.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>Right to erasure.</b>
          {' '}
          Where you have a right to erasure under GDPR Article 17 or
          an equivalent regime, the operator can remove the hash from
          its own database and from this site&apos;s indexed display,
          subject to the legitimate-interest balancing in Article
          17(3). The operator <i>cannot</i> remove the hash from the
          Gridcoin chain — that is the nature of a public ledger and
          part of why the Service is useful as evidence. Other people
          running their own Gridcoin nodes will continue to index the
          payload independently.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>Lawful requests.</b>
          {' '}
          The operator will respond to lawful requests from competent
          authorities to the extent technically possible. The operator
          does not collect submitter identifiers and so has no
          submitter PII to disclose; the on-chain record is outside
          the operator&apos;s technical control.
        </Typography>
      </Box>
    </Box>
  );
}
