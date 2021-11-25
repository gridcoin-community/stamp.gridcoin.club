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

  public isFinished() {
    return this.tx && this.block && this.time;
  }

  public toJson(): Partial<StampRawData> {
    const json: Partial<StampRawData> = {};
    if (this.id) {
      json.id = String(this.id);
    }
    if (this.protocol) {
      json.protocol = this.protocol;
    }
    if (this.hash) {
      json.hash = this.hash;
    }
    if (this.block) {
      json.block = this.block;
    }
    if (this.tx) {
      json.tx = this.tx;
    }
    if (this.time) {
      json.time = this.time;
    }
    return json;
  }
}
