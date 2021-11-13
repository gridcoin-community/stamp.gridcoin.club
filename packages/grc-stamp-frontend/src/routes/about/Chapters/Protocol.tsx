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
}));

function ChapterProtocol() {
  return (
    <Box pb={3} id="protocol-overview">
      <Typography variant="h4" component="h3" pb={2}>
        Protocol Overview
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          The data is stamped via embedding the sha256 hash of the data in the gridcoin blockchain.
          A special transaction gets generated that encodes the hash via OP_RETURN script which marks the transaction&apo;s output as unspendable.
          This script allows a small amount of data to be inserted.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          The typical transaction may look like this:
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
          The difference between those two is that the second transaction has 2 hashes instead of one. The data allowed with the OP_RETURN script is sufficient to keep two sha256 hashes, so it is totally fine to have more than a single record.
          It also helps to save on fees, as instead of two separate transactions we can have just one.
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Let&apos;s see what the transaction consists of:
        </Typography>
        <CodePaper variant="outlined" elevation={0}>
          <b>6a46</b>
          {' '}
          - This is the hexadecimal representation of the OP_RETURN script
          <br />
          <br />
          <b>5ea1ed</b>
          {' '}
          - The code, special character sequence, so we can recognize stamp transactions and process them. This is a `Hex word` and it reads like &ldquo;Sealed&rdquo;.
          <br />
          <br />
          <b>000001</b>
          {' '}
          - Protocol version. We use
          {' '}
          <Link rel="nofollow" href="https://semver.org/">semantic versioning</Link>
          , the current protocol version is 0.0.1. All further versions of the current service shall support all legacy protocols.
          <br />
          <br />
          <b>5bbbbbee48b735693478140de1b7f09fe0acddc0c7bce87f8665074efe53410f</b>
          {' '}
          - First sha256 hash
          <br />
          <br />
          <b>7158380aca149fa8422fb1274a69155303d4aaa76bf67defe0bb31628293afd2</b>
          {' '}
          - Second sha256 hash (may not be presented)
        </CodePaper>
      </Box>
    </Box>
  );
}

export const Protocol = React.memo(ChapterProtocol);
