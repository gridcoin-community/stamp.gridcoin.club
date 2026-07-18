import { Typography, Box } from '@mui/material';
import React from 'react';

export function Service() {
  return (
    <Box id="service" sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        What stamp is, and isn’t
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          The Service is a Proof of Existence tool. Your browser
          computes a SHA-256 hash of a file you choose, sends that
          hash to the Service&apos;s API, and the Service writes it
          into a Gridcoin OP_RETURN transaction under a public
          protocol (
          <code>5ea1ed</code>
          {' '}
          on mainnet,
          {' '}
          <code>f055aa</code>
          {' '}
          on testnet). The file itself never leaves your device. The
          on-chain record is permanent and globally readable.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          The Service is <b>not</b>:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mt: 0 }}>
          <Typography component="li" variant="body1" gutterBottom>
            a Qualified Trust Service Provider under eIDAS Regulation
            (EU) 910/2014, and the timestamps it produces are not
            qualified electronic timestamps under Article 42 of that
            regulation;
          </Typography>
          <Typography component="li" variant="body1" gutterBottom>
            a notary, bailiff, court witness, certifying authority,
            or any other officer of any legal system;
          </Typography>
          <Typography component="li" variant="body1" gutterBottom>
            a payment service, money transmitter, money services
            business, virtual-asset service provider, crypto-asset
            service provider, custodian, exchange, or broker;
          </Typography>
          <Typography component="li" variant="body1" gutterBottom>
            a provider of legal, tax, accounting, or evidentiary
            advice.
          </Typography>
        </Box>
        <Typography gutterBottom variant="body1" component="p">
          The Service publishes opaque hashes and renders chain state.
          You provide the hashes; the Gridcoin chain stores them; the
          Service is a convenience layer in between. Anyone can run
          their own instance against the same protocol, and anyone
          can run a Gridcoin node and index the same OP_RETURN
          payloads independently of this site.
        </Typography>
      </Box>
    </Box>
  );
}
