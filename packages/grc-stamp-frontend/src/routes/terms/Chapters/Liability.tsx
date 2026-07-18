import { Typography, Box } from '@mui/material';
import React from 'react';

export function Liability() {
  return (
    <Box id="liability" sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Limitation of liability
      </Typography>
      <Box component="article">
        <Typography
          gutterBottom
          variant="body2"
          component="p"
          sx={{ fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase' }}
        >
          To the maximum extent permitted by law, the operator will
          not be liable for any indirect, incidental, special,
          consequential, exemplary, or punitive damages, including
          lost profits, lost revenue, lost data, lost case outcomes,
          lost GRC, lost opportunities, business interruption, or
          substitute-procurement cost, arising out of or relating to
          the Service, however caused, whether in contract, tort
          (including negligence), strict liability, or any other
          theory, even if the operator has been advised of the
          possibility of such damages.
        </Typography>
        <Typography
          gutterBottom
          variant="body2"
          component="p"
          sx={{ fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase' }}
        >
          Without limiting the foregoing, the operator will not be
          liable for: (i) damages arising from reliance on a stamp
          in any dispute, proceeding, negotiation, transaction, or
          publication; (ii) the rejection or limited weight given
          to a stamp by any court, tribunal, regulator, or
          counterparty; (iii) outages, errors, forks, reorgs, or
          attacks on the Gridcoin network; (iv) outages or errors of
          any wallet, explorer, or third-party tool integrated with
          or linked from the Service; (v) consequences of your loss
          or compromise of files, keys, or proof URLs.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Nothing in these Terms excludes or limits liability that
          cannot lawfully be excluded or limited, including liability
          for death or personal injury caused by negligence, fraud,
          fraudulent misrepresentation, or any non-waivable
          consumer-protection right under the law of your habitual
          residence.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          You agree to indemnify and hold the operator harmless from
          any claim, demand, loss, or expense (including reasonable
          legal fees) arising from your use of the Service in
          violation of these Terms or of any applicable law.
        </Typography>
      </Box>
    </Box>
  );
}
