import React from 'react';
import {
  Stack,
  Modal,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';

interface Props {
  // open: boolean;
  back: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  boxShadow: 24,
  p: 2,
};

export function ErrorInsufficientFunds({ back }: Props) {
  return (
    <Modal open>
      <Box>
        <Card sx={style}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" mb={3}>
              Insufficient Funds
            </Typography>
            <Typography variant="body1" color="text.body2" sx={{ textAlign: 'justify' }}>
              We are out of gridcoins. So at this moment it is impossible to submit a transaction.
              This service is free for you, but we have to pay transaction fees.
              <br />
              Despite the fact this is a very small amount of gridcoins
              (about 0.001 grc per stamp) we ran out of funds.
              <br />
              <br />
              <i>What can I do to have my document stamped?</i>
              <br />
              <br />
              You can donate a small amount of gridcoins directly to the service wallet:
              {' '}
              <b>{ process.env.NEXT_PUBLIC_WALLET_ADDRESS }</b>
              {' '}
              <br />
              Or you can use any faucet and use the service address as a recipient.
              {' '}
              Or you can set up your wallet to side stake the very small amount to this service.
              We will apprecite this!
              <br />
              <br />
              All funds donated to the service wallet will be used to stamp documents.
              <br />
              <br />
              Help us to keep this service free of charge!
            </Typography>
          </CardContent>
          <CardActions>
            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{ width: '100%' }}
              spacing={2}
            >
              <Button variant="outlined" onClick={back}>Back to the main page</Button>
            </Stack>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
}
