/* eslint @typescript-eslint/no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMessage } from '@twurple/chat';
import { TwitchChatService } from '../application/service/twitch-chat-service';
import { ChatCommandRegistry } from '../application/registry/chat-command.registry';
import { ChatCommandOptions } from '../domain/decorator/chat-command-handler.decorator';
import { ChatCommand } from '../domain/base/chat-command';
import { TwitchException } from '../application/exception/twitch.exception';
import { isChattable } from '../domain/interface/chattable';

@Injectable()
export class TwitchChatListener implements OnModuleInit {
  private readonly _logger = new Logger(TwitchChatListener.name);

  constructor(
    private readonly _chat: TwitchChatService,
    private readonly _registry: ChatCommandRegistry,
    private readonly _config: ConfigService,
  ) {}

  onModuleInit(): void {
    const prefix = this._config.getOrThrow<string>('TWITCH__PREFIX');

    const chatClient = this._chat.chatClient;

    chatClient.onMessageFailed((channelName, reason) =>
      this._logger.error(
        `message in channel '${channelName}' failed to send: ${reason}`,
      ),
    );

    chatClient.onAuthenticationFailure((reason, retryCount) =>
      this._logger.error(
        `Chat authentication failed: ${reason}, retries: ${retryCount}`,
      ),
    );

    chatClient.onConnect(() =>
      this._logger.log('Successfully connected to Twitch'),
    );

    chatClient.onJoin((channel, user) =>
      this._logger.log(`Joined channel '${channel}' as '${user}'`),
    );

    chatClient.onMessage(
      (
        channelName: string,
        userName: string,
        rawText: string,
        messageCtx: ChatMessage,
      ) => {
        void this._dispatch(prefix, channelName, userName, rawText, messageCtx);
      },
    );
  }

  private async _dispatch(
    prefix: string,
    channelName: string,
    userName: string,
    rawText: string,
    messageCtx: ChatMessage,
  ): Promise<void> {
    if (!rawText.startsWith(prefix)) {
      return;
    }

    const [rawName] = rawText.slice(prefix.length).trim().split(/\s+/);

    if (!rawName) {
      return;
    }

    const entry = this._registry.get(rawName);

    if (!entry) {
      return;
    }

    if (!this._satisfiesPermissions(messageCtx, entry.metadata)) {
      return;
    }

    try {
      await entry.handler.execute(
        ChatCommand.create(channelName, userName, messageCtx),
      );
    } catch (exception: unknown) {
      if (exception instanceof TwitchException) {
        this._logger.error(exception.message);
        if (isChattable(exception)) {
          await this._chat.sendMessage(channelName, exception.chatMessage);
        }
      }
    }
  }

  private _satisfiesPermissions(
    _messageCtx: ChatMessage,
    _metadata: ChatCommandOptions,
  ): boolean {
    return true;
  }
}
