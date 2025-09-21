import {
  List, Divider,
} from '@mui/material';
import React from 'react';
import { Info } from '@/components/Info/Info';
import { StampEntity } from '@/entities/StampEntity';
import { StampBlockchainData } from '@/components/Info/StampBlockchainData';
import { useSSEEvent } from '@/hooks';
import { getFirstFromTheStore, getStampInfoById } from '../actions';
import { FilesContext } from '../context';
import { ActionType } from '../reducer';

interface Props {
  isUploading: boolean;
}

export function BlockchainData({ isUploading }: Props) {
  const { state, dispatch } = React.useContext(FilesContext);
  const idRef = React.useRef<NodeJS.Timeout | 0>(0);

  const fileData = getFirstFromTheStore(state);
  const stamp = new StampEntity(fileData.blockchainData);

  const getInfo = async (): Promise<void> => {
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
  };

  if (stamp.isFinished()) {
    clearInterval(idRef.current as NodeJS.Timeout);
    idRef.current = 0;
  }

  useSSEEvent('stampSubmitted', () => {
    getInfo();
  });
  useSSEEvent('transactionFound', () => {
    getInfo();
  });

  React.useEffect(() => {
    if (isUploading && !stamp.isFinished()) {
      idRef.current = setInterval(async () => {
        getInfo();
      }, 20_000);
    }
    return () => {
      clearInterval(idRef.current as NodeJS.Timeout);
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
