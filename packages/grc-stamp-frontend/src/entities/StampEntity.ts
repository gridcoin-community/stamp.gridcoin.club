export interface StampRawData {
  protocol: string;
  type: string;
  hash: string;
  block: number;
  tx: string;
  rawTransaction: string;
  time: number;
  createdAt: string;
  updatedAt: string;
  id: string;
  links: { self: string };
}

// export enum

export class StampEntity {
  public id?: number;

  public protocol?: string;

  public hash?: string;

  public block?: number;

  public tx?: string;

  public time?: number;

  public constructor(data?: Partial<StampRawData>) {
    if (data) {
      this.id = Number(data.id) || undefined;
      this.protocol = data?.protocol;
      this.hash = data?.hash;
      this.block = data?.block;
      this.tx = data?.tx;
      this.time = data?.time;
    }
  }
}
