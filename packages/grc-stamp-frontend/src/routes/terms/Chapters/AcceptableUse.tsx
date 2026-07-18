import { Typography, Box } from '@mui/material';
import React from 'react';

export function AcceptableUse() {
  return (
    <Box id="acceptable-use" sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Eligibility and acceptable use
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          You may use the Service only if using it is lawful in your
          jurisdiction, and you are not located in, a national of, or
          owned or controlled by a person in any country or region
          subject to comprehensive UN, EU, UK, Swiss, or US
          sanctions, and you are not on any of those authorities&apos;
          sanctions lists. You confirm each of these by using the
          Service.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          You agree not to use the Service:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mt: 0 }}>
          <Typography component="li" variant="body1" gutterBottom>
            to deceive a court, regulator, counterparty, or
            insurer about the time at which a file existed;
          </Typography>
          <Typography component="li" variant="body1" gutterBottom>
            to register hashes derived from child sexual abuse
            material, non-consensual intimate imagery, or other
            material whose creation or possession is criminal in
            your jurisdiction or in the operator&apos;s
            jurisdiction;
          </Typography>
          <Typography component="li" variant="body1" gutterBottom>
            to register hashes derived from personal data of
            another person unless you are the data subject or you
            have a lawful basis under applicable data-protection
            law (see <i>Privacy and personal data</i> below);
          </Typography>
          <Typography component="li" variant="body1" gutterBottom>
            to circumvent sanctions, export controls, or other
            applicable trade laws;
          </Typography>
          <Typography component="li" variant="body1" gutterBottom>
            to launch, assist, or facilitate denial-of-service
            against the Service, the Gridcoin network, or any
            third-party dependency;
          </Typography>
          <Typography component="li" variant="body1" gutterBottom>
            to bypass rate limits, scrape beyond what the public
            API permits, or otherwise abuse the operator&apos;s
            wallet by inducing fee burn at scale.
          </Typography>
        </Box>
        <Typography gutterBottom variant="body1" component="p">
          The Service has no way to inspect what a hash represents
          (a SHA-256 hash is opaque by design), so prevention of the
          above is on you. The operator may refuse, rate-limit, or
          terminate access for any reason it considers appropriate,
          including suspected violation of these rules.
        </Typography>
      </Box>
    </Box>
  );
}
