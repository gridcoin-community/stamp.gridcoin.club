export function txUrl(tx: string | undefined) {
  if (tx) {
    return process.env.NEXT_PUBLIC_EXPLORER_TX_URL?.replace(/\[data\]/, String(tx));
  }
  // eslint-disable-next-line no-script-url
  return 'javascript:void(0);';
}

export function blockUrl(block: number | undefined) {
  if (block) {
    return process.env.NEXT_PUBLIC_EXPLORER_BLOCK_URL?.replace(/\[data\]/, String(block));
  }
  // eslint-disable-next-line no-script-url
  return 'javascript:void(0);';
}
