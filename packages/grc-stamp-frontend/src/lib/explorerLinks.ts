export function txUrl(tx: string | undefined): string | undefined {
  if (tx) {
    return process.env.NEXT_PUBLIC_EXPLORER_TX_URL?.replace(/\[data\]/, String(tx));
  }
  return undefined;
}

export function blockUrl(block: number | undefined): string | undefined {
  if (block) {
    return process.env.NEXT_PUBLIC_EXPLORER_BLOCK_URL?.replace(/\[data\]/, String(block));
  }
  return undefined;
}
