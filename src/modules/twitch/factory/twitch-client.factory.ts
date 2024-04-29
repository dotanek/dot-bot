import { Config } from '../../../config/config';
import { TwitchClient } from '../types/twitch-client';
import { Client } from 'tmi.js';
import { ConfigKey } from '../../../config/enum/config-key.enum';

export class TwitchClientFactory {
  static get(config: Config): TwitchClient {
    return  new Client({
      options: { debug: false },
      identity: {
        username: config.getEnvironmental<string>(
          ConfigKey.TWITCH_USERNAME,
        ),
        password: config.getEnvironmental<string>(ConfigKey.TWITCH_TOKEN),
      },
      channels: config.twitch.channels,
    });
  }
}
