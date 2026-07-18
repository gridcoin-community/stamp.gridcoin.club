import { Typography, Box } from '@mui/material';
import React from 'react';

export function WhatItProves() {
  return (
    <Box id="what-it-proves" sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        What a stamp proves, and what it doesn’t
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          A stamp proves one fact: <b>this exact 32-byte SHA-256 hash
          appeared inside a Gridcoin block at a specific block
          height, with the block&apos;s timestamp.</b>
          {' '}
          From that, and from holding the original file, you can show
          that the file existed in that exact form by that block
          time, because flipping a single bit changes the hash.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          A stamp does <b>not</b> prove who controlled or authored
          the file, that the file is original or unique, that the
          stamp is the earliest existence of the file, that the
          submitter has any rights in the file, or that the file&apos;s
          contents are accurate, lawful, or reliable. If you need to
          show authorship or intent on top of existence, pair the
          stamp with a signature, a contract, or other corroborating
          evidence.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          On evidentiary value:
          {' '}
          <b>in the EU,</b>
          {' '}
          a stamp is a non-qualified electronic timestamp under
          Article 41(1) of eIDAS. It is admissible as evidence and
          may not be denied legal effect solely on the grounds that
          it is electronic or non-qualified, but it does not enjoy
          the automatic presumption of accuracy granted to qualified
          timestamps under Article 42. Its weight in any given case
          is for the court to decide. (See, for example, the
          Tribunal Judiciaire de Marseille decision of March 2025
          accepting a public-blockchain timestamp as proof of
          copyright anteriority.) Italy&apos;s Article 8-ter of Law
          12/2019 grants blockchain timestamps eIDAS-equivalent
          effect by statute.
          {' '}
          <b>In the United States,</b>
          {' '}
          blockchain records are admissible under Federal Rule of
          Evidence 901(b)(9) and under DLT-evidence statutes in
          Vermont, Arizona, Ohio, Washington, and Delaware, among
          others.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          None of the foregoing is legal advice. If a stamp matters
          to a real dispute, talk to a lawyer in the relevant
          jurisdiction.
        </Typography>
      </Box>
    </Box>
  );
}
