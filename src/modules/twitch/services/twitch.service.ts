import { ChatUserstate, Client } from 'tmi.js';
import config from '../../../config/config';
import { TwitchException } from '../exception/twitch.exception';
import { TwitchClient } from '../types/twitch-client';
import { UnableToConnectException } from '../exception/unable-to-connect.exception';
import { TwitchEvent } from '../enum/twitch-event.enum';
import { CommandProvider } from '../provider/command.provider';
import { ChatMessage } from '../value-objects/chat-message';
import { TwitchContext } from '../value-objects/twitch-context';

export class TwitchService {
  private readonly twitchClient: TwitchClient;
  private readonly commandProvider: CommandProvider;

  constructor() {
    this.twitchClient = this.createTwitchClient();
    this.commandProvider = new CommandProvider(this.twitchClient);
  }

  async initialize(): Promise<boolean> {
    return await this.initializeTwitchClient();
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
        const command = await this.commandProvider.getBy(chatCommand.command);

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

  private createTwitchClient(): TwitchClient {
    return new Client({
      options: { debug: false },
      identity: {
        username: config.twitch.username,
        password: config.twitch.token,
      },
      channels: config.twitch.channels,
    });
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
