import {
  List, Divider,
} from '@mui/material';
import React from 'react';
import { Info } from 'components/Info/Info';
import { StampEntity } from 'entities/StampEntity';
import { StampBlockchainData } from 'components/Info/StampBlockchainData';
import { getFirstFromTheStore, getStampInfoById } from '../actions';
import { FilesContext } from '../context';
import { ActionType } from '../reducer';

interface Props {
  isUploading: boolean;
}

export function BlockchainData({ isUploading }: Props) {
  const { state, dispatch } = React.useContext(FilesContext);
  const idRef = React.useRef<NodeJS.Timer | 0>(0);

  const fileData = getFirstFromTheStore(state);
  const stamp = new StampEntity(fileData.blockchainData);

  if (stamp.isFinished()) {
    clearInterval(idRef.current as NodeJS.Timer);
    idRef.current = 0;
  }

  React.useEffect(() => {
    if (isUploading && !stamp.isFinished()) {
      idRef.current = setInterval(async () => {
        if (fileData.dataId) {
          const info = await getStampInfoById(fileData.dataId);
          if (!info) return;
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
        <StampBlockchainData stamp={stamp} />
      </>
      )}
    </List>
  );
}
