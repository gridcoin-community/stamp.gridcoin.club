import { Sequelize } from 'sequelize';
import { config } from '../config';

export const db = new Sequelize(
  config.MYSQL_DB,
  config.MYSQL_LOGIN,
  config.MYSQL_PASSWORD,
  {
    host: config.MYSQL_HOST,
    dialect: 'mysql',
    logging: true,
  },
);

export function getDb(): Promise<Sequelize> {
  return Promise.resolve(db);
}
