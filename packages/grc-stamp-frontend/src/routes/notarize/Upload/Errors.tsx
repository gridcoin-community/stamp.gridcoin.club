import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface Props {
  code: string;
}

export function Errors({ code }: Props) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (code) {
      setOpen(true);
    }
  }, [code]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {code}
      </MuiAlert>
    </Snackbar>
  );
}
