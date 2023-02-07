/* eslint-disable max-len */
import {
  Typography, Box, Paper, Link,
} from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';

const CodePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  fontFamily: 'monospace',
  overflowX: 'auto',
  maxWidth: '100%',
}));

function ChapterProtocol() {
  return (
    <Box pb={3} id="protocol-overview">
      <Typography variant="h4" component="h3" pb={2}>
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
        <CodePaper variant="outlined" elevation={0}>
          6a265ea1ed0000015f334f14161952476adde3fbd843f93f647d47a0d7e30eb5d1635fb7569a2503
        </CodePaper>
        <Typography gutterBottom variant="body1" component="p">
          or like that:
        </Typography>
        <CodePaper variant="outlined" elevation={0}>
          6a465ea1ed0000015bbbbbee48b735693478140de1b7f09fe0acddc0c7bce87f8665074efe53410f7158380aca149fa8422fb1274a69155303d4aaa76bf67defe0bb31628293afd2
        </CodePaper>
        <Typography gutterBottom variant="body1" component="p">
          The key difference between the two transactions is that the second one includes two hashes,
          while the first one only has one.
          The OP_RETURN script is capable of accommodating two sha256 hashes, allowing for more than one record to be stored in a single transaction.
          This not only helps to save on fees but also makes it more efficient.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Let&apos;s take a closer look at what makes up the transaction:
        </Typography>
        <CodePaper variant="outlined" elevation={0}>
          <b>6a46</b>
          {' '}
          - This is the hexadecimal representation of the OP_RETURN script
          <br />
          <br />
          <b>5ea1ed</b>
          {' '}
          - A unique sequence of characters that helps identify the stamp transaction and process it. This is known as a &ldquo;hex word&rdquo; and reads as &ldquo;Sealed&rdquo;.
          <br />
          <br />
          <b>000001</b>
          {' '}
          - The protocol version. The current version at the time of writing is 0.0.1, using
          {' '}
          <Link rel="nofollow" href="https://semver.org/">semantic versioning</Link>
          . All future versions shall support legacy protocols.
          <br />
          <br />
          <b>5bbbbbee48b735693478140de1b7f09fe0acddc0c7bce87f8665074efe53410f</b>
          {' '}
          - The first sha256 hash.
          <br />
          <br />
          <b>7158380aca149fa8422fb1274a69155303d4aaa76bf67defe0bb31628293afd2</b>
          {' '}
          - The second sha256 hash (if present).
        </CodePaper>
      </Box>
    </Box>
  );
}

export const Protocol = React.memo(ChapterProtocol);
