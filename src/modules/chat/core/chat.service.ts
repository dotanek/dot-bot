import { ChatUserstate, Client as TwitchClient } from 'tmi.js';
import { Config } from '../../../config/config';
import { ConfigKey } from '../../../config/enum/config-key.enum';
import { ChatEvent } from './enum/chat-event.enum';
import { ChatException } from './exception/chat.exception';
import { UnableToConnectChatException } from './exception/unable-to-connect.chat-exception';
import { DependencyProvider } from '../../../application/provider/dependency.provider';
import { ModuleName } from '../../../application/enum/module-name.enum';
import { CommandsFacade } from '../../command/external/commands.facade';
import { ChatMessage } from './value-object/chat-message';
import { CommandsGateway } from '../external/gateway/commands.gateway';
import { ChatMessageFactory } from './factory/chat-message.factory';

export class ChatService {
  private readonly twitchClient: TwitchClient;

  constructor(
    private readonly config: Config,
    private readonly commandsGateway: CommandsGateway,
    private readonly chatMessageFactory: ChatMessageFactory,
  ) {
    this.twitchClient = this.createTwitchClient(config);
  }

  private handleMessage(content: string, channel: string): void {
    const message = this.chatMessageFactory.getFrom(content, channel);

    if (message.isCommand) {
      const result = this.commandsGateway.runCommandFor(message);

      this.twitchClient.say(channel, result);
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

    this.twitchClient.on(
      ChatEvent.MESSAGE,
      (
        channel: string,
        userstate: ChatUserstate,
        message: string,
        self: boolean,
      ) => this.handleMessage(message, channel),
    );

    return true;
  }
}
