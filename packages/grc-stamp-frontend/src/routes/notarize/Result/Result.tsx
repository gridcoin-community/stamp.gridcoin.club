import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {
  Button, CardActions, useTheme,
} from '@mui/material';
import { getFirstFromTheStore, storeToBlockchain } from '../actions';
import { FilesContext } from '../context';
import { FilePreview } from './FilePreview';
import { ActionType } from '../reducer';
import { BlockchainData } from './BlockchainData';

interface Props {
  // next: any;
  back: any;
}

export function Result({ back }: Props) {
  const { state, dispatch } = React.useContext(FilesContext);
  const [isUploading, setUploading] = React.useState(false);
  const theme = useTheme();

  const onCancel = () => {
    dispatch({ type: ActionType.clear });
    back();
  };

  const fileData = getFirstFromTheStore(state);

  const saveButtonDisabled = !fileData.hash || fileData.existing || isUploading;
  const cancelButtonDisabled = !fileData.hash || isUploading;

  const onUpload = async () => {
    setUploading(true);
    const id = await storeToBlockchain(fileData.hash as string);
    dispatch({
      type: ActionType.setId,
      payload: { id: fileData.file.name, dataId: id },
    });
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      mt: 4,
      mb: 4,
    }}
    >
      <Card sx={{
        width: 'auto',
        minWidth: theme.spacing(120),
      }}
      >
        <Box sx={{ display: 'flex' }}>
          <FilePreview file={fileData.file} preview={fileData.preview} />
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h5" sx={{ pb: 3 }}>
                {fileData.file.name}
              </Typography>
              <BlockchainData isUploading={isUploading} />
            </CardContent>
          </Box>
        </Box>
        <CardActions>
          <Button
            variant="outlined"
            color="error"
            onClick={onCancel}
            disabled={cancelButtonDisabled}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={onUpload}
            disabled={saveButtonDisabled}
          >
            Store to the blockchain
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
