import { Model, DataTypes } from 'sequelize';
import { db } from '../lib/sql';

export enum StampType {
  sha256 = 'sha256',
  ipfs = 'ipfs',
}

export interface StampModelInterface {
  id?: number;
  protocol?: string;
  type?: StampType;
  hash?: string;
  block?: number;
  tx?: string;
  rawTransaction?: string;
  time?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class StampModel extends Model implements StampModelInterface {
  public id!: number;

  public protocol!: string;

  public type!: StampType;

  public hash!: string;

  public block: number;

  public tx: string;

  public rawTransaction: string;

  public time: number;

  public readonly createdAt: Date;

  public readonly updatedAt: Date;
}

StampModel.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  protocol: DataTypes.STRING(16),
  type: DataTypes.ENUM(...Object.keys(StampType)),
  hash: DataTypes.STRING(256),
  block: DataTypes.BIGINT({ unsigned: true }),
  tx: DataTypes.STRING(64),
  rawTransaction: DataTypes.TEXT,
  time: DataTypes.INTEGER({ unsigned: true }),
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize: db,
  timestamps: true,
  underscored: true,
  tableName: 'stamps',
});
