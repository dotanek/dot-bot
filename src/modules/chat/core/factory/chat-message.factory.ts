import { Config } from '../../../../config/config';
import { ChatMessage } from '../value-object/chat-message';
import { MessageSanitizationUtil } from '../util/message-sanitization.util';

export class ChatMessageFactory {
  constructor(private readonly config: Config) {}

  getFrom(content: string, channel: string): ChatMessage {
    return new ChatMessage(
      MessageSanitizationUtil.sanitize(content),
      content.startsWith(this.config.twitch.commands.prefix),
      channel,
    );
  }
}
