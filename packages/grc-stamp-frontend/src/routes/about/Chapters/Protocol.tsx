/* eslint-disable max-len */
import { Typography, Box } from '@mui/material';
import React from 'react';
import { NextMuiLink } from '@/components/NextMuiLink';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';

export function Protocol() {
  return (
    <Box pb={3} id="protocol-overview">
      <Typography variant="h4" component="h2" pb={2}>
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
          The OP_RETURN script is capable of accommodating two sha256 hashes, allowing for more than one record to be stored in a single transaction.
          This not only helps to save on fees but also makes it more efficient.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Let&apos;s take a closer look at what makes up the transaction:
        </Typography>
        <CodeBlock
          caption="Transaction anatomy"
          language="bash"
          code={`# OP_RETURN script opcode (hex)
6a46

# "Sealed" identifier — hex word that marks stamp transactions
5ea1ed

# Protocol version (0.0.1, semantic versioning — legacy versions stay supported)
000001

# First SHA-256 hash
5bbbbbee48b735693478140de1b7f09fe0acddc0c7bce87f8665074efe53410f

# Second SHA-256 hash (optional — present only in two-hash transactions)
7158380aca149fa8422fb1274a69155303d4aaa76bf67defe0bb31628293afd2`}
        />
        <Typography gutterBottom variant="body1" component="p" sx={{ pt: 1 }}>
          For the full protocol reference, semantic versioning conventions are described at
          {' '}
          <NextMuiLink rel="nofollow" href="https://semver.org/">semver.org</NextMuiLink>
          .
        </Typography>
      </Box>
    </Box>
  );
}
