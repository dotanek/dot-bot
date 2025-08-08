import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { Config } from '../config/config';
import { Quote } from '../modules/twitch/entity/quote.entity';
import { User } from '../modules/twitch/entity/user.entity';
import { Wealth } from '../modules/twitch/entity/wealth.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PPResponse } from '../modules/twitch/entity/pp-response.entity';
import { PpResponseAssignment } from '../modules/twitch/entity/pp-response.assignment';
import { LoveAssignment } from '../modules/twitch/entity/love.entity';

const config = Config.getInstance().database;

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  port: config.port,
  host: config.host,
  username: config.username,
  password: config.password,
  database: config.database,
  synchronize: config.synchronize,
  logging: config.logging,
  entities: [Quote, User, Wealth, PPResponse, PpResponseAssignment, LoveAssignment],
  migrations: [`${__dirname}\\migration\\*.ts`],
  namingStrategy: new SnakeNamingStrategy(),
  ssl: false,
};

console.log(__dirname + '\\' + 'migration');

export default databaseConfig;
