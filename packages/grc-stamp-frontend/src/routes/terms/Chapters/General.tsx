import { Typography, Box } from '@mui/material';
import React from 'react';
import { ObfuscatedEmail } from '@/components/ObfuscatedEmail';

const EMAIL_USER = 'gridcat';
const EMAIL_DOMAIN = 'proton.me';
const GOVERNING_LAW = '[Operator’s principal place of business]';
const EFFECTIVE_DATE = '2026-05-07';

export function General() {
  return (
    <Box id="general" sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        General
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          <b>Governing law.</b>
          {' '}
          These Terms, and any dispute arising out of them or out of
          your use of the Service, are governed by the laws of
          {' '}
          {GOVERNING_LAW}
          , without regard to conflict-of-laws principles. The
          courts of {GOVERNING_LAW} have exclusive jurisdiction. If
          you are a consumer habitually resident in the European
          Union, the United Kingdom, or another jurisdiction whose
          consumer-protection law cannot lawfully be displaced by
          contract, you also retain the protections of the mandatory
          law of your residence.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>Changes to these Terms.</b>
          {' '}
          The operator may update these Terms at any time. The
          effective date at the bottom of this page reflects the
          current version. Your continued use of the Service after
          the effective date of a change constitutes acceptance of
          the updated Terms; if you do not accept, stop using the
          Service.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>Severability and waiver.</b>
          {' '}
          If any provision of these Terms is held invalid or
          unenforceable, the rest remains in full effect. The
          operator&apos;s failure to enforce any right or provision
          is not a waiver of that right or provision.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>Force majeure.</b>
          {' '}
          The operator is not liable for delay or failure to perform
          caused by events beyond its reasonable control, including
          outages or attacks on the Gridcoin network, blockchain
          forks or reorganisations, hosting-provider failures,
          governmental or regulatory action, court orders, war,
          civil unrest, sanctions, embargoes, fire, flood, extreme
          weather, pandemic, and disease.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>No agency.</b>
          {' '}
          Nothing in these Terms creates a partnership, agency,
          employment, joint venture, or fiduciary relationship
          between you and the operator.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>Entire agreement.</b>
          {' '}
          These Terms, together with the policies referenced from
          them and the licence governing the source code, are the
          entire agreement between you and the operator regarding
          the Service.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          <b>Contact.</b>
          {' '}
          General queries:{' '}
          <ObfuscatedEmail user={EMAIL_USER} domain={EMAIL_DOMAIN} />
          . Abuse reports, lawful-process correspondence, IP
          infringement notices, and authority requests:{' '}
          <ObfuscatedEmail user={EMAIL_USER} domain={EMAIL_DOMAIN} />
          . The operator accepts service of process and authority
          correspondence in English at this address.
        </Typography>
        <Typography
          gutterBottom
          variant="caption"
          component="p"
          color="text.secondary"
          sx={{ pt: 2 }}
        >
          Effective date: {EFFECTIVE_DATE}
        </Typography>
      </Box>
    </Box>
  );
}
