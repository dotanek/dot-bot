import { ChatUserstate, Client } from 'tmi.js';
import { Config } from '../../../config/config';
import { ConfigKey } from '../../../config/enum/config-key.enum';
import { ChatEvent } from './enum/chat-event.enum';
import { ChatException } from './exception/chat.exception';
import { UnableToConnectChatException } from './exception/unable-to-connect.chat-exception';
import { ChatCommandService } from '../../command/core/chat-command.service';
import { TwitchClient } from './types/twitch-client';
import {ChatTarget} from "./value-object/chat-target";

export class ChatService {
  private readonly twitchClient: TwitchClient;

  constructor(
    private readonly config: Config,
    private readonly chatCommandService: ChatCommandService,
  ) {
    this.twitchClient = this.createTwitchClient(config);
  }

  private handleMessage(
    content: string,
    channel: string,
    userstate: ChatUserstate,
  ): void {
    const chatTarget = ChatTarget.create(this.twitchClient, this.config, content, channel, userstate);

    if (chatTarget.isMessageCommand()) {
      this.chatCommandService.runCommandFor(chatTarget);
    }
  }

  private catchException(exception: ChatException): void {
    console.error(exception.message);
  }

  private createTwitchClient(config: Config): TwitchClient {
    return new Client({
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
      ) => this.handleMessage(message, channel, userstate),
    );
    /* eslint-enable */

    return true;
  }
}
