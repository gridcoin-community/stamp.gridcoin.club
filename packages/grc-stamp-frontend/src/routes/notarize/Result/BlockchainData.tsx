import { TableContainer, Table, TableBody } from '@mui/material';
import React from 'react';
import { getFirstFromTheStore, getStampInfoById } from '../actions';
import { FilesContext } from '../context';
import { ActionType } from '../reducer';
import { BlockInfo } from './BlockInfo';
import { HashInfo } from './HashInfo';
import { TimeInfo } from './TimeInfo';
import { TXInfo } from './TXInfo';

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
    <TableContainer>
      <Table>
        <TableBody>
          <HashInfo hash={fileData.hash} />
          {(fileData.blockchainData || isUploading) && (
          <>
            <TXInfo tx={transaction} />
            <BlockInfo block={block} />
            <TimeInfo time={time} />
          </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
