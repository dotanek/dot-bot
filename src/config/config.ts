import { ConfigKey } from './enum/config-key.enum';
import { ConfigException } from './exception/config.exception';
import { configDotenv } from 'dotenv';
import {MissingEvConfigException} from "./exception/missing-ev.config-exception";

export class Config {
  readonly twitch = {
    channels: ['dotanek'],
    commands: {
      prefix: '!',
    },
  };

  constructor() {
    configDotenv();
  }

  getEnvironmental<T extends string | number>(key: ConfigKey): T {
    const value = process.env[key];

    if (value === undefined) {
      throw new MissingEvConfigException(key);
    }

    return value as T;
  }
}
