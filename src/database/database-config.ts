import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { Config } from '../config/config';
import { Quote } from '../modules/twitch/entity/quote.entity';
import { User } from '../modules/twitch/entity/user.entity';
import { Wealth } from '../modules/twitch/entity/wealth.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
  entities: [Quote, User, Wealth],
  migrations: [`${__dirname}\\migration\\*.ts`],
  namingStrategy: new SnakeNamingStrategy(),
};

console.log(__dirname + '\\' + 'migration');

export default databaseConfig;
