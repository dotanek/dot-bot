import { ChatUserstate, Client as TwitchClient, Userstate } from 'tmi.js';
import { Config } from '../../../config/config';
import { ConfigKey } from '../../../config/enum/config-key.enum';
import { ChatEvent } from './enum/chat-event.enum';
import { ChatException } from './exception/chat.exception';
import { UnableToConnectChatException } from './exception/unable-to-connect.chat-exception';
import { ChatMessageFactory } from './factory/chat-message.factory';
import { ChatCommandService } from '../../command/core/chat-command.service';

export class ChatService {
  private readonly twitchClient: TwitchClient;

  constructor(
    private readonly config: Config,
    private readonly chatCommandService: ChatCommandService,
    private readonly chatMessageFactory: ChatMessageFactory,
  ) {
    this.twitchClient = this.createTwitchClient(config);
  }

  private handleMessage(
    content: string,
    userstate: Userstate,
    channel: string,
  ): void {
    const message = this.chatMessageFactory.getFrom(content, channel);

    if (message.isCommand) {
      const result = this.chatCommandService.runCommandFor(message);

      this.twitchClient.say(channel, result.getValueOrThrow());
    }
  }

  private catchException(exception: ChatException): void {
    console.error(exception.message);
  }

  private createTwitchClient(config: Config): TwitchClient {
    return new TwitchClient({
      options: { debug: false },
      identity: {
        username: config.getEnvironmental<string>(ConfigKey.TWITCH_USERNAME),
        password: config.getEnvironmental<string>(ConfigKey.TWITCH_TOKEN),
      },
      channels: config.twitch.channels,
    });
  }

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

    /* eslint-disable */
    this.twitchClient.on(
      ChatEvent.MESSAGE,
      (
        channel: string,
        userstate: ChatUserstate,
        message: string,
        self: boolean,
      ) => this.handleMessage(message, userstate, channel),
    );
    /* eslint-enable */

    return true;
  }
}
