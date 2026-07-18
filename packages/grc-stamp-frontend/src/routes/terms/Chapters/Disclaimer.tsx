import { Typography, Box } from '@mui/material';
import React from 'react';

export function Disclaimer() {
  return (
    <Box id="disclaimer" sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Disclaimer of warranties
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          This service is provided as-is, without any warranty of any
          kind, express or implied. This includes the stamping web
          application, the public API, and the Gridcoin Stamp GitHub
          Action. We make no guarantees about availability,
          correctness, durability, or fitness for a particular
          purpose.
        </Typography>
        <Typography
          gutterBottom
          variant="body2"
          component="p"
          sx={{ fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase' }}
        >
          To the maximum extent permitted by law, the operator
          disclaims all warranties, express or implied, including
          merchantability, fitness for a particular purpose,
          non-infringement, accuracy, completeness, durability,
          availability, security, and quiet enjoyment. The operator
          does not warrant that the service will be uninterrupted,
          error-free, secure, or free of malware, that any defect
          will be corrected, or that any timestamp produced will be
          admitted, given any specific weight, or accepted as proof
          in any court, tribunal, regulatory proceeding, or other
          forum.
        </Typography>
        <Typography
          gutterBottom
          variant="body2"
          component="p"
          sx={{ fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase' }}
        >
          The operator does not warrant the operation, security, or
          continuity of the Gridcoin network, of any wallet software,
          of any blockchain explorer, or of any other third-party
          dependency. The operator does not warrant against forks,
          reorganisations, or attacks on the underlying chain that
          could affect a stamp&apos;s representation or apparent
          time.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Some jurisdictions do not allow the exclusion of certain
          warranties. To the extent any warranty cannot lawfully be
          excluded, it is limited to the minimum scope and shortest
          duration permitted by that law, and your exclusive remedy
          is the discontinuation of your use of the Service.
        </Typography>
      </Box>
    </Box>
  );
}
