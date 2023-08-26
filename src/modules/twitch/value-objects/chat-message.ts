import { ChatCommand } from './chat-command';
import { MessageSanitizationUtil } from '../util/message-sanitization.util';
import config from '../../../config/config';

export class ChatMessage {
  constructor(
    readonly content: string,
    readonly isCommand: boolean,
  ) {}

  static create(message: string): ChatMessage {
    return new ChatMessage(
      MessageSanitizationUtil.sanitize(message),
      message.startsWith(config.twitch.commands.prefix),
    );
  }

  toChatCommand(): ChatCommand {
    return ChatCommand.from(this);
  }
}
