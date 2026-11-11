import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import router from 'next/router';
import { useWallet } from '@/lib/walletContext';
import { track } from '@/lib/track';
import { FilesContext, ErrorContext } from '../context';
import { ActionType } from '../reducer';
import { hashFiles, checkForExistence } from '../actions';
import { fileMaxSize } from '../constants';

interface Props {
  next: () => void;
}

const DropBox = styled('div')(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 5,
  borderColor: theme.palette.grey[500],
  borderStyle: 'dashed',
  borderWidth: '5px',
  height: '40vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.spacing(120),
}));

export function Upload({ next }: Props) {
  const { dispatch } = useContext(FilesContext);
  const { setError } = useContext(ErrorContext);
  const { wallet } = useWallet();
  const isLowFunds = wallet?.isLowFunds ?? false;

  const onDrop = (acceptedFiles: File[], _rejections: FileRejection[], event: DropEvent) => {
    setError(undefined);
    const file = acceptedFiles[0];
    if (file) {
      // A drop arrives as a 'drop' event, the file picker as the input's 'change'.
      const method = 'type' in event && event.type === 'drop' ? 'drag' : 'click';
      track('Notarize Step', { step: 'File Selected', method });
      if (isLowFunds) track('Notarize Step', { step: 'Low Funds' });
      dispatch({ type: ActionType.add, payload: { file } });
      hashFiles(file)
        .then((hash) => {
          track('Notarize Step', { step: 'Hash Computed' });
          dispatch({
            type: ActionType.hash,
            payload: {
              id: file.name,
              hash,
            },
          });
          return checkForExistence(hash);
        })
        .then((blockchainData) => {
          if (blockchainData) {
            track('Notarize Step', { step: 'Already Stamped' });
            router.push(`/proof/${blockchainData.hash}`);
          }
        })
        .catch((err) => {
          track('Notarize Step', { step: 'Error', kind: 'lookup' });
          throw err;
        });
      next();
    }
  };

  const onDropRejected = (rejection: FileRejection[]) => {
    // We only accept single file
    const errors = rejection[0];
    if (errors) {
      const err = errors.errors[0];
      if (err) {
        track('Notarize Step', { step: 'Error', kind: err.code });
        setError(err.code);
      }
    }
  };

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: fileMaxSize,
    onDropRejected,
  });

  return (
    <Box sx={{
      my: 4,
      display: 'flex',
      justifyContent: 'center',
    }}
    >
      <DropBox {...getRootProps()}>
        <input {...getInputProps()} />
        <Typography variant="body1" gutterBottom sx={{
          pl: 1,
          pr: 1,
          textAlign: 'center',
        }}>
          {isLowFunds
            ? "Stamping is paused. Drop a file to check whether it's already on-chain."
            : 'Drag n drop your file here, or click to select.'}
        </Typography>
      </DropBox>
    </Box>
  );
}
