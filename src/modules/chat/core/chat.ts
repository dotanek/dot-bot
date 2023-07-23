import {ChatUserstate, Client as TwitchClient} from 'tmi.js';
import { Config } from '../../../config/config';
import { ConfigKey } from '../../../config/enum/config-key.enum';
import { ChatEvent } from './enum/chat-event.enum';
import { ChatException } from './exception/chat.exception';
import { UnableToConnectChatException } from './exception/unable-to-connect.chat-exception';

export class Chat {
  private _initialized = false;

  get initialized(): boolean {
    return this._initialized;
  }

  constructor(private readonly twitchClient: TwitchClient) {
    this.initialize();
  }

  private initialize(): void {
    this.twitchClient
      .connect()
      .then(() => {
        this.twitchClient.on(ChatEvent.MESSAGE, this.handleMessage.bind(this));

        this._initialized = true;
      })
      .catch((error: string) => {
        this.catchException(new UnableToConnectChatException(error));
      });
  }

  private handleMessage(channel: string, userstate: ChatUserstate, message: string, self: boolean): void {
    console.log(`[${userstate.username}]: ${message}`)
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
