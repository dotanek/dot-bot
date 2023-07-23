import { ConfigKey } from './enum/config-key.enum';
import { ConfigException } from './exception/config.exception';
import { configDotenv } from 'dotenv';

export class Config {
  readonly twitch = {
    channels: ['dotanek'],
  };

  constructor() {
    configDotenv();
  }

  getEnvironmental<T extends string | number>(key: ConfigKey): T {
    const value = process.env[key];

    if (value === undefined) {
      throw new ConfigException('Missing environment variable ');
    }

    return value as T;
  }
}
