import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import { useDropzone, FileRejection } from 'react-dropzone';
import { styled, Theme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { FilesContext, ErrorContext } from '../context';
import { ActionType } from '../reducer';
import { hashFiles, checkForExistance } from '../actions';
import { fileMaxSize } from '../constants';

interface Props {
  next: () => void;
}

const DropBox = styled('div')(({ theme }: { theme: Theme }) => ({
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

  const onDrop = (acceptedFiles: File[]) => {
    setError(undefined);
    const file = acceptedFiles.shift();
    if (file) {
      dispatch({ type: ActionType.add, payload: { file } });
      hashFiles(file)
        .then((hash) => {
          dispatch({
            type: ActionType.hash,
            payload: {
              id: file.name,
              hash,
            },
          });
          return checkForExistance(hash);
        })
        .then((blockchainData) => {
          if (blockchainData) {
            dispatch({
              type: ActionType.existing,
              payload: {
                id: file.name,
                blockchainData,
              },
            });
          }
        });
      next();
    }
  };

  const onDropRejected = (rejection: FileRejection[]) => {
    // We only accept single file
    const errors = rejection.shift();
    if (errors) {
      const err = errors.errors.shift();
      if (err) {
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
    <>
      <Box sx={{
        my: 4,
        display: 'flex',
        justifyContent: 'center',
      }}
      >
        {/* <Typography variant="h4" component="h1" gutterBottom> */}
        <DropBox {...getRootProps()}>
          <input {...getInputProps()} />
          <Typography variant="body1" gutterBottom>
            Drag n drop your file here, or click to select.
          </Typography>
        </DropBox>
        {/* </Typography> */}
      </Box>
    </>
  );
}
