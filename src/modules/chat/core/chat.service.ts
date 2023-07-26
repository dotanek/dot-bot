import { ChatUserstate, Client as TwitchClient } from 'tmi.js';
import { Config } from '../../../config/config';
import { ConfigKey } from '../../../config/enum/config-key.enum';
import { ChatEvent } from './enum/chat-event.enum';
import { ChatException } from './exception/chat.exception';
import { UnableToConnectChatException } from './exception/unable-to-connect.chat-exception';
import { DependencyProvider } from '../../../application/provider/dependency.provider';
import { ModuleName } from '../../../application/enum/module-name.enum';
import { CommandsGateway } from '../external/gateway/commandsGateway';
import { CommandsFacade } from '../../command/external/commands.facade';
import { ChatMessage } from './value-object/chat-message';

export class ChatService {
  private readonly twitchClient: TwitchClient;

  constructor(
    private readonly config: Config,
    private readonly dependencyProvider: DependencyProvider,
  ) {
    this.twitchClient = this.createTwitchClient(config);
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

    this.twitchClient.on(ChatEvent.MESSAGE, this.handleMessage.bind(this));

    return true;
  }

  private handleMessage(
    channel: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean,
  ): void {
    if (message.startsWith(this.config.twitch.commands.prefix)) {
      const result = this.dependencyProvider
        .getFacadeFor<CommandsFacade>(ModuleName.COMMANDS)
        .runCommandFor(new ChatMessage(message));

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
}
