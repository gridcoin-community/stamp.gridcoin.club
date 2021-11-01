import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {
  Button, CardActions, Stack, useMediaQuery, useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getFirstFromTheStore, storeToBlockchain } from '../actions';
import { FilesContext, ErrorContext } from '../context';
import { FilePreview } from './FilePreview';
import { ActionType } from '../reducer';
import { BlockchainData } from './BlockchainData';
import { Steps } from '../constants';
import { Progress } from './Progress';
import { ErrorInsufficientFunds } from './ErrorInsufficientFunds';

const MainCard = styled(Card)(({ theme }) => ({
  width: 'auto',
  minWidth: theme.spacing(130),
  [theme.breakpoints.down('lg')]: {
    minWidth: theme.spacing(110),
  },
  [theme.breakpoints.down('md')]: {
    minWidth: 'auto',
    width: '100%',
  },
}));

interface Props {
  next: any;
  back: any;
  activeStep: number;
}

export function Result({ back, next, activeStep }: Props) {
  const { state, dispatch } = React.useContext(FilesContext);
  const { setError } = React.useContext(ErrorContext);
  const [isUploading, setUploading] = React.useState(false);
  const [isFundError, setFundError] = React.useState(false);
  const theme = useTheme();
  const showFilePreview = useMediaQuery(theme.breakpoints.up('md'));

  const onCancel = () => {
    dispatch({ type: ActionType.clear });
    back();
  };

  const fileData = getFirstFromTheStore(state);

  const saveButtonDisabled = !fileData.hash || fileData.existing || isUploading;
  const cancelButtonDisabled = !fileData.hash || isUploading;
  const transaction = fileData.blockchainData?.tx;
  const block = fileData.blockchainData?.block;
  const time = fileData.blockchainData?.time;
  const finished = transaction && block && time;

  if (finished && activeStep < Steps.Upload) {
    next();
  }

  const onUpload = async () => {
    try {
      const id = await storeToBlockchain(fileData.hash as string);
      dispatch({
        type: ActionType.setId,
        payload: { id: fileData.file.name, dataId: id },
      });
      setUploading(true);
    } catch (error: any) {
      if (error.response?.status === 406) {
        setFundError(true);
      } else {
        // console.log(error.response);
        const res = error.response?.data?.errors;
        if (res && res[110]) {
          setError(res[0].title);
        } else {
          setError(`Unknown error ${error.response?.status}`);
        }
        back();
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4} mb={4}>
      {isFundError && <ErrorInsufficientFunds back={back} />}
      <MainCard>
        <Box display="flex">
          {showFilePreview && <FilePreview file={fileData.file} preview={fileData.preview} />}
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
          <Progress fileData={fileData} isUploading={isUploading} />
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ width: '100%' }}
            spacing={2}
          >
            {finished ? (
              <Button
                onClick={onCancel}
                variant="outlined"
                color="primary"
              >
                Stamp another file
              </Button>
            ) : (
              <>
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
              </>
            )}
          </Stack>
        </CardActions>
      </MainCard>
    </Box>
  );
}
