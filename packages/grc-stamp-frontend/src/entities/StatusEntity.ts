export interface StatusRawData {
  name: string;
  version: number;
  maintenance: boolean;
}

export class StatusEntity {
  public name: string;

  public version: number;

  public maintenance: boolean;

  public constructor(data: StatusRawData) {
    this.name = data.name;
    this.version = data.version;
    this.maintenance = data.maintenance;
  }
}
