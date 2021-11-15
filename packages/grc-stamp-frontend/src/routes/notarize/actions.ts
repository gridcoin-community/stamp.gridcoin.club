import { sha256 } from 'js-sha256';
import axios from 'axios';
import { StampRepository } from 'repositories/StampsRepository';
import { StampEntity } from 'entities/StampEntity';
import {
  BlockchainData, FileData, StateInterface,
} from './reducer';

export function readFile(file: File): Promise<ArrayBuffer | undefined> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
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

export async function checkForExistence(
  hash: string,
): Promise<BlockchainData | null> {
  // Get the very first one from the store
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stamps?filter[hash]=${hash}`);
  if (data?.meta?.count > 0) {
    const existing = data.data[0];
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
  const res: any = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stamps`, {
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
): Promise<StampEntity | null> {
  const repository = new StampRepository();
  return repository.getStampById(dataId);
}

export function readableFileSize(size: number): string {
  let newSize = size;
  const isFloat = (n: any) => Number(n) === n && n % 1 !== 0;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = 0;
  while (newSize >= 1024) {
    newSize /= 1024;
    ++i;
  }
  return `${isFloat(newSize) ? newSize.toFixed(1) : newSize} ${units[i]}`;
}
