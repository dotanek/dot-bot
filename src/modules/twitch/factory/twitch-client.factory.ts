import { Config } from '../../../config/config';
import { TwitchClient } from '../types/twitch-client';
import { Client } from 'tmi.js';
import { ConfigKey } from '../../../config/enum/config-key.enum';

export class TwitchClientFactory {
  constructor(private readonly config: Config) {}

  get(): TwitchClient {
    const twitchClient = new Client({
      options: { debug: false },
      identity: {
        username: this.config.getEnvironmental<string>(
          ConfigKey.TWITCH_USERNAME,
        ),
        password: this.config.getEnvironmental<string>(ConfigKey.TWITCH_TOKEN),
      },
      channels: this.config.twitch.channels,
    });

    return twitchClient;
  }
}
