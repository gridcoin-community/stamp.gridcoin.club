 
import { Typography, Box } from '@mui/material';
import React from 'react';
import { NextMuiLink } from '@/components/NextMuiLink';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';

export function Protocol() {
  return (
    <Box id="protocol-overview" sx={{ pb: 3 }}>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Protocol Summary
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          The data is stamped on the Gridcoin blockchain by embedding the sha256 hash of the data in a transaction.
          This is achieved through the use of an OP_RETURN script opcode, which creates an unspendable output in the transaction that encodes the hash.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          A typical transaction may contain one or two hashes, such as:
        </Typography>
        <CodeBlock
          caption="Single-hash transaction"
          language="text"
          code="6a265ea1ed0000015f334f14161952476adde3fbd843f93f647d47a0d7e30eb5d1635fb7569a2503"
        />
        <Typography gutterBottom variant="body1" component="p">
          or like that:
        </Typography>
        <CodeBlock
          caption="Two-hash transaction"
          language="text"
          code="6a465ea1ed0000015bbbbbee48b735693478140de1b7f09fe0acddc0c7bce87f8665074efe53410f7158380aca149fa8422fb1274a69155303d4aaa76bf67defe0bb31628293afd2"
        />
        <Typography gutterBottom variant="body1" component="p">
          The key difference between the two transactions is that the second one includes two hashes,
          while the first one only has one.
          The OP_RETURN script can accommodate two SHA-256 hashes, so more than one record can be stored in a single transaction.
          That saves on fees.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          The transaction breaks down as:
        </Typography>
        <CodeBlock
          caption="Transaction anatomy"
          language="bash"
          code={`# OP_RETURN script opcode (hex)
6a46

# "Sealed" identifier: hex word that marks stamp transactions
5ea1ed

# Protocol version (0.0.1, semantic versioning; legacy versions stay supported)
000001

# First SHA-256 hash
5bbbbbee48b735693478140de1b7f09fe0acddc0c7bce87f8665074efe53410f

# Second SHA-256 hash (optional; present only in two-hash transactions)
7158380aca149fa8422fb1274a69155303d4aaa76bf67defe0bb31628293afd2`}
        />
        <Typography gutterBottom variant="body1" component="p" sx={{ pt: 1 }}>
          For the full protocol reference, semantic versioning conventions are described at
          {' '}
          <NextMuiLink rel="nofollow" href="https://semver.org/">semver.org</NextMuiLink>
          .
        </Typography>

        <Typography variant="h6" component="h3" id="verify-a-stamp" sx={{ pt: 2, pb: 1 }}>
          Verify a stamp yourself
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          None of this depends on stamp.gridcoin.club. Anyone can check a stamp
          against the Gridcoin chain directly:
        </Typography>
        <Box component="ol" sx={{ pl: 3 }}>
          <Typography component="li" variant="body1" gutterBottom>
            Compute the SHA-256 hash of your file yourself, for example with
            {' '}
            <code>sha256sum yourfile.pdf</code>
            . This is the value that should have been stamped.
          </Typography>
          <Typography component="li" variant="body1" gutterBottom>
            Open the stamping transaction on a block explorer such as
            {' '}
            <NextMuiLink rel="nofollow" href="https://gridcoinstats.eu">gridcoinstats.eu</NextMuiLink>
            . Search by the transaction id shown on your proof page.
          </Typography>
          <Typography component="li" variant="body1" gutterBottom>
            In the transaction&apos;s OP_RETURN output, check that the data reads
            {' '}
            <code>5ea1ed</code>
            {' '}
            followed by the version and your hash. If your SHA-256 is there, the
            file existed in that exact form when the block was mined.
          </Typography>
          <Typography component="li" variant="body1" gutterBottom>
            Read the block&apos;s timestamp. That time is what the stamp proves.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
