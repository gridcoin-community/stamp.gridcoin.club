import {
  List, Divider,
} from '@mui/material';
import React from 'react';
import { format } from 'date-fns';
import { getFirstFromTheStore, getStampInfoById } from '../actions';
import { FilesContext } from '../context';
import { ActionType } from '../reducer';
import { Info } from './Info';

interface Props {
  isUploading: boolean;
}

export function BlockchainData({ isUploading }: Props) {
  const { state, dispatch } = React.useContext(FilesContext);
  const idRef = React.useRef<NodeJS.Timer | 0>(0);

  const fileData = getFirstFromTheStore(state);
  const transaction = fileData.blockchainData?.tx;
  const block = fileData.blockchainData?.block;
  const time = fileData.blockchainData?.time;
  const finished = transaction && block && time;

  if (finished) {
    clearInterval(idRef.current as NodeJS.Timer);
    idRef.current = 0;
  }

  React.useEffect(() => {
    if (isUploading && !finished) {
      idRef.current = setInterval(async () => {
        if (fileData.dataId) {
          const info = await getStampInfoById(fileData.dataId);
          if (info.block) {
            dispatch({
              type: ActionType.setBlock,
              payload: { id: fileData.file.name, block: info.block },
            });
          }
          if (info.tx) {
            dispatch({
              type: ActionType.setTransaction,
              payload: { id: fileData.file.name, transaction: info.tx },
            });
          }
          if (info.time) {
            dispatch({
              type: ActionType.setTime,
              payload: { id: fileData.file.name, time: info.time },
            });
          }
        }
      }, 5000);
    }
    return () => {
      clearInterval(idRef.current as NodeJS.Timer);
      idRef.current = 0;
    };
  });

  return (
    <List>
      <Info
        title="Hash"
        value={fileData.hash}
      />
      {(fileData.blockchainData || isUploading) && (
      <>
        <Divider variant="fullWidth" component="li" />
        <Info
          title="TX ID"
          value={transaction}
          link={process.env.NEXT_PUBLIC_EXPLORER_TX_URL?.replace(/\[data\]/, String(transaction))}
        />
        <Divider variant="fullWidth" component="li" />
        <Info
          title="Block"
          link={process.env.NEXT_PUBLIC_EXPLORER_BLOCK_URL?.replace(/\[data\]/, String(block))}
          value={block}
        />
        <Divider variant="fullWidth" component="li" />
        <Info
          title="Time"
          value={time && format(new Date(time * 1000), 'PPpp ')}
        />
      </>
      )}
    </List>
  );
}
