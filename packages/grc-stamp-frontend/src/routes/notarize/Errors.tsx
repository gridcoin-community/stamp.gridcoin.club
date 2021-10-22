import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { fileMaxSize } from './constants';
import { readableFileSize } from './actions';
import { ErrorContext } from './context';

const errorMap: { [key: string]: string } = {
  'too-many-files': 'You can only stamp the single file at once',
  'file-too-large': `The file is too big, maximum file size allowed is ${readableFileSize(fileMaxSize)}`,
};

export function Errors() {
  const [open, setOpen] = React.useState(false);
  const { error } = React.useContext(ErrorContext);

  React.useEffect(() => {
    if (error && error.length) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const errorMessage = errorMap[error || ''] || error;

  return (
    <Snackbar
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity="error"
        sx={{ width: '100%' }}
      >
        {errorMessage}
      </MuiAlert>
    </Snackbar>
  );
}
