import { ConfigKey } from './enum/config-key.enum';
import { configDotenv } from 'dotenv';
import { MissingEvConfigException } from './exception/missing-ev.config-exception';
import { DatabaseType } from 'typeorm';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';

export class Config {
  readonly twitch;
  readonly database: DataSourceOptions;

  constructor() {
    configDotenv();

    this.twitch = {
      channels: ['dotanek'],
      commands: {
        prefix: '!',
      },
      username: this.getEnvironmental<string>(ConfigKey.TWITCH_USERNAME),
      token: this.getEnvironmental<string>(ConfigKey.TWITCH_TOKEN),
    };

    this.database = {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: this.getEnvironmental<string>(ConfigKey.DATABASE_USER),
      password: this.getEnvironmental<string>(ConfigKey.DATABASE_PASSWORD),
      database: this.getEnvironmental<string>(ConfigKey.DATABASE_NAME),
      synchronize: false,
      logging: true,
    };
  }

  getEnvironmental<T extends string | number>(key: ConfigKey): T {
    const value = process.env[key];

    if (value === undefined) {
      throw new MissingEvConfigException(key);
    }

    return value as T;
  }
}
