import { sha256 } from 'js-sha256';
import axios from 'axios';
import {
  BlockchainData, FileData, StateInterface,
} from './reducer';

export function readFile(file: File): Promise<ArrayBuffer | undefined> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      // console.log('loaded');
      resolve(event?.target?.result as ArrayBuffer | undefined);
    };
    reader.onerror = (event) => {
      reader.abort();
      reject(event);
    };
    reader.readAsArrayBuffer(file);
  });
}

export function stateHasFile(state: StateInterface): boolean {
  return state && Object.keys(state).length > 0;
}

export function getFirstFromTheStore(state: StateInterface): FileData {
  const key = Object.keys(state)[0];
  if (key && state[key]) {
    return state[key];
  }
  throw new Error('Can not get element from the store');
}

export function hashFiles(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Get the very first one from the store
    // const fileData = getFirstFromTheStore(store);
    readFile(file).then(async (binary) => {
      if (binary) {
        const hash = sha256.update(binary);
        resolve(hash.toString());
      } else {
        reject(new Error('Can not hash data'));
      }
    });
  });
}

export async function checkForExistance(
  hash: string,
): Promise<BlockchainData | null> {
  // Get the very first one from the store
  // const fileData = getFirstFromTheStore(store);
  const { data } = await axios.get(`${process.env.API_URL}/stamps?filter[hash]=${hash}`);
  // const { data } = await axios.get(`http://localhost:7000/stamps?filter[hash]=${'f6fc84c9f21c24907d6bee6eec38cabab5fa9a7be8c4a7827fe9e56f245bd2d5'}`);
  // console.log(data);
  if (data?.meta?.count > 0) {
    const existing = data.data[0];
    // console.log(existing);
    return {
      block: existing.attributes.block,
      tx: existing.attributes.tx,
      time: existing.attributes.time,
    };
  }
  return null;
}

export async function storeToBlockchain(hash: string): Promise<string | undefined> {
  if (!hash) return undefined;
  const res: any = await axios.post(`${process.env.API_URL}/stamps`, {
    data: {
      type: 'stamps',
      attributes: {
        hash,
      },
    },
  });
  const { id } = res.data.data;
  return id;
}

export async function getStampInfoById(
  dataId: number,
): Promise<{ block?: number, tx?: string, time?: number }> {
  const result = await axios.get(`${process.env.API_URL}/stamps/${dataId}`);
  const { block, tx, time } = result.data.data.attributes;
  return { block, tx, time };
}

export function readableFileSize(size: number): string {
  let newSize = size;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = 0;
  while (newSize >= 1024) {
    newSize /= 1024;
    ++i;
  }
  return `${newSize.toFixed(1)} ${units[i]}`;
}
