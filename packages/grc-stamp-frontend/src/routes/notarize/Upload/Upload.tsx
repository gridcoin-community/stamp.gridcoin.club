import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import { useDropzone, FileRejection } from 'react-dropzone';
import { styled, Theme } from '@mui/material/styles';
import { FilesContext } from '../context';
import { ActionType } from '../reducer';
import { Errors } from './Errors';
import { hashFiles, checkForExistance } from '../actions';

interface Props {
  next: () => void;
}

const DropBox = styled('div')(({ theme }: { theme: Theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 5,
  borderColor: theme.palette.grey[500],
  borderStyle: 'dashed',
  borderWidth: '5px',
  height: '50vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export function Upload({ next }: Props) {
  const { dispatch } = useContext(FilesContext);

  const [messageCode, setMessageCode] = React.useState('');

  const onDrop = (acceptedFiles: File[]) => {
    setMessageCode('');
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
        setMessageCode(err.code);
      }
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 1024,
    onDropRejected,
  });

  return (
    <>
      <Box sx={{ my: 4 }}>
        {/* <Typography variant="h4" component="h1" gutterBottom> */}
        <DropBox {...getRootProps()}>
          <input {...getInputProps()} />
          {
                isDragActive
                  ? <p>Drop any file here</p>
                  : <p>Drag n drop some files here, or click to select files</p>
              }
        </DropBox>
        {/* </Typography> */}
      </Box>
      <Errors code={messageCode} />
    </>
  );
}
