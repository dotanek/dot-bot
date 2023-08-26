import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { Config } from '../config/config';
import { Quote } from '../modules/twitch/entity/quote.entity';

const config = Config.getInstance().database;

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  port: config.port,
  host: config.host,
  username: config.username,
  password: config.password,
  database: config.database,
  synchronize: false,
  logging: true,
  entities: [Quote],
  migrations: [`${__dirname}\\migration\\*.ts`],
};

console.log(__dirname + '\\' + 'migration');

export default databaseConfig;
