import { Client as TwitchClient } from 'tmi.js';
import { Config } from '../../../config/config';
import { ConfigKey } from '../../../config/enum/config-key.enum';
import { ChatEvent } from './enum/chat-event.enum';
import { ChatException } from './exception/chat.exception';
import { UnableToConnectChatException } from './exception/unable-to-connect.chat-exception';

export class Chat {
  constructor(private readonly twitchClient: TwitchClient) {}

  async initialize(): Promise<boolean> {
    try {
      await this.twitchClient.connect();
    } catch (error: unknown) {
      if (typeof error === 'string') {
        this.catchException(new UnableToConnectChatException(error));

        return false;
      } else {
        throw error;
      }
    }

    this.twitchClient.on(ChatEvent.MESSAGE, this.handleMessage.bind(this));

    return true;
  }

  private handleMessage() /* channel: string,
     userstate: ChatUserstate,
     message: string,
     self: boolean,*/
  : void {
    // not implemented
  }

  private catchException(exception: ChatException): void {
    console.error(exception.message);
  }

  static create(config: Config): Chat {
    const twitchClient = new TwitchClient({
      options: { debug: false },
      identity: {
        username: config.getEnvironmental<string>(ConfigKey.TWITCH_USERNAME),
        password: config.getEnvironmental<string>(ConfigKey.TWITCH_TOKEN),
      },
      channels: config.twitch.channels,
    });

    return new Chat(twitchClient);
  }
}
