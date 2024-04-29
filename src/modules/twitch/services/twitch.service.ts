import { ChatUserstate } from 'tmi.js';
import { TwitchException } from '../exception/twitch.exception';
import { TwitchClient } from '../types/twitch-client';
import { UnableToConnectException } from '../exception/unable-to-connect.exception';
import { TwitchEvent } from '../enum/twitch-event.enum';
import { COMMAND_PROVIDER, ICommandProvider } from '../provider/command.provider';
import { ChatMessage } from '../value-objects/chat-message';
import { TwitchContext } from '../value-objects/twitch-context';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';
import { TWITCH_CLIENT } from '../const/twitch-client.key';

export const TWITCH_SERVICE = 'twitch-service';

export interface ITwitchService {
  initialize(): Promise<boolean>;
}

export class TwitchService implements ITwitchService {
  private readonly twitchClient: TwitchClient;
  private readonly commandProvider: ICommandProvider;

  constructor() {
    const dependencyProvider = DependencyProvider.getInstance();

    this.twitchClient = dependencyProvider.get(TWITCH_CLIENT);
    this.commandProvider = dependencyProvider.get(COMMAND_PROVIDER);
  }

  async initialize(): Promise<boolean> {
    return (
      await Promise.all([
        this.initializeTwitchClient(),
      ])
    ).every((result) => result);
  }

  private async handleChatMessageEvent(
    message: string,
    channel: string,
    userstate: ChatUserstate,
  ): Promise<void> {
    const chatMessage = ChatMessage.create(message);
    const twitchContext = TwitchContext.create(channel, userstate);

    try {
      if (chatMessage.isCommand) {
        const chatCommand = chatMessage.toChatCommand();
        const command = this.commandProvider.getBy(chatCommand.command);

        await command.execute(chatCommand, twitchContext);
      }
    } catch (exception: unknown) {
      if (exception instanceof TwitchException) {
        this.catchException(exception);
      } else {
        throw exception;
      }
    }
  }

  private async initializeTwitchClient(): Promise<boolean> {
    try {
      await this.twitchClient.connect();

      this.twitchClient.on(
        TwitchEvent.CHAT_MESSAGE,
        (
          /* eslint-disable */
          channel: string,
          userstate: ChatUserstate,
          message: string,
          self: boolean,
          /* eslint-enable */
        ) => this.handleChatMessageEvent(message, channel, userstate),
      );
    } catch (error: unknown) {
      if (typeof error === 'string') {
        this.catchException(new UnableToConnectException(error));

        return false;
      } else {
        throw error;
      }
    }
    return true;
  }

  private catchException(exception: TwitchException): void {
    console.error(exception);
  }
}
