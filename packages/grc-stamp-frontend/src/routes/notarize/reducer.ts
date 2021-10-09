export interface BlockchainData {
  block?: number;
  tx?: string;
  time?: number;
}

export interface FileData {
  file: File;
  preview?: string;
  hash?: string;
  existing: boolean;
  blockchainData?: BlockchainData;
  dataId?: number;
}

export interface StateInterface {
  [key: string]: FileData;
}

export enum ActionType {
  clear,
  add,
  remove,
  hash,
  existing,
  setId,
  setTransaction,
  setBlock,
  setTime,
}

export type Action =
  | { type: ActionType.hash, payload: { id: string, hash: string } }
  | { type: ActionType.clear }
  | { type: ActionType.remove, payload: { id: string } }
  | { type: ActionType.add, payload: { file: File } }
  | { type: ActionType.existing, payload: { id: string, blockchainData: BlockchainData } }
  | { type: ActionType.setId, payload: { id: string, dataId: number } }
  | { type: ActionType.setTransaction, payload: { id: string, transaction: string } }
  | { type: ActionType.setBlock, payload: { id: string, block: number } }
  | { type: ActionType.setTime, payload: { id: string, time: number } };

export const InitialState: StateInterface = {};

export function reducer(
  state: StateInterface,
  action: Action,
): StateInterface {
  switch (action.type) {
    case ActionType.setId: {
      const withId = { ...state };
      const { id, dataId } = action.payload;
      if (withId[id]) {
        withId[id] = { ...withId[id], dataId };
      }
      return withId;
    }

    case ActionType.setTime: {
      const withBlochainData = { ...state };
      const { id, time } = action.payload;
      if (withBlochainData[id]) {
        withBlochainData[id] = {
          ...withBlochainData[id],
          blockchainData: {
            ...withBlochainData[id].blockchainData,
            time,
          },
        };
      }
      return withBlochainData;
    }

    case ActionType.setBlock: {
      const withBlochainData = { ...state };
      const { id, block } = action.payload;
      if (withBlochainData[id]) {
        withBlochainData[id] = {
          ...withBlochainData[id],
          blockchainData: {
            ...withBlochainData[id].blockchainData,
            block,
          },
        };
      }
      return withBlochainData;
    }

    case ActionType.setTransaction: {
      const withBlochainData = { ...state };
      const { id, transaction } = action.payload;
      if (withBlochainData[id]) {
        withBlochainData[id] = {
          ...withBlochainData[id],
          blockchainData: {
            ...withBlochainData[id].blockchainData,
            tx: transaction,
          },
        };
      }
      return withBlochainData;
    }

    case ActionType.existing: {
      const withExisting = { ...state };
      const { id, blockchainData } = action.payload;
      if (withExisting[id]) {
        withExisting[id] = { ...withExisting[id], existing: true, blockchainData };
      }
      return withExisting;
    }

    case ActionType.hash: {
      const withHash = { ...state };
      const { id, hash } = action.payload;
      if (withHash[id]) {
        withHash[id] = { ...withHash[id], hash };
      }
      return withHash;
    }

    case ActionType.clear: {
      Object.values(state).forEach(
        (file) => file.preview && URL.revokeObjectURL(file.preview),
      );
      return InitialState;
    }

    case ActionType.remove: {
      const { id } = action.payload;
      const withRemovedItem = { ...state };
      const entry = withRemovedItem[id] || undefined;
      if (entry) {
        if (entry.preview) {
          URL.revokeObjectURL(entry.preview);
        }
        delete withRemovedItem[id];
      }
      return withRemovedItem;
    }

    case ActionType.add: {
      const withNewItem = { ...state };
      const { file } = action.payload;
      withNewItem[file.name] = {
        file,
        preview: URL.createObjectURL(file),
        existing: false,
      };
      return withNewItem;
    }

    default:
      throw new Error('Action type is unknown');
  }
}
