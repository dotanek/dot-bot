import { Injectable } from '@nestjs/common';
import { TwitchChatService } from '../../application/service/twitch-chat-service';
import { ChatMessage } from '@twurple/chat';

export class ChatCommand {
  constructor(
    readonly channelName: string,
    readonly userName: string,
    readonly messageCtx: ChatMessage,
  ) {}

  static create(
    channelName: string,
    userName: string,
    messageCtx: ChatMessage,
  ): ChatCommand {
    return new ChatCommand(channelName, userName, messageCtx);
  }
}

@Injectable()
export abstract class ChatCommandHandlerBase {
  constructor(protected readonly _chatService: TwitchChatService) {}

  abstract execute(command: ChatCommand): Promise<void> | void;
}
