import {
  List, Divider,
} from '@mui/material';
import React, { useCallback, useContext, useEffect } from 'react';
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
  const { state, dispatch } = useContext(FilesContext);

  const fileData = getFirstFromTheStore(state);
  const stamp = new StampEntity(fileData.blockchainData);
  const isFinished = stamp.isFinished();
  const { dataId } = fileData;
  const fileName = fileData.file.name;

  const getInfo = useCallback(async (): Promise<void> => {
    if (!dataId) return;
    const info = await getStampInfoById(dataId);
    if (!info) return;
    if (info.block) {
      dispatch({ type: ActionType.setBlock, payload: { id: fileName, block: info.block } });
    }
    if (info.tx) {
      dispatch({
        type: ActionType.setTransaction,
        payload: { id: fileName, transaction: info.tx },
      });
    }
    if (info.time) {
      dispatch({ type: ActionType.setTime, payload: { id: fileName, time: info.time } });
    }
  }, [dataId, fileName, dispatch]);

  useSSEEvent('stampSubmitted', () => {
    if (!isFinished) getInfo();
  });
  useSSEEvent('transactionFound', () => {
    if (!isFinished) getInfo();
  });

  useEffect(() => {
    if (!isUploading || isFinished) return undefined;
    const id = setInterval(() => { getInfo(); }, 30_000);
    return () => clearInterval(id);
  }, [isUploading, isFinished, getInfo]);

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
