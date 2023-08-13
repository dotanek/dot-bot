import { ChatMessage } from './chat-message';
import { ChatUser } from './chat-user';
import { ChatRoom } from './chat-room';
import { TwitchClient } from '../types/twitch-client';
import { Config } from '../../../../config/config';
import { ChatUserstate } from 'tmi.js';
import { MessageSanitizationUtil } from '../util/message-sanitization.util';

export class ChatTarget {
  constructor(
    private readonly user: ChatUser,
    private readonly room: ChatRoom,
    private readonly message: ChatMessage,
  ) {}

  isMessageCommand(): boolean {
    return this.message.isCommand;
  }

  getMessageContent(): string {
    return this.message.content;
  }

  send(message: string): void {
    this.room.send(message);
  }

  getUserName(): string {
    return this.user.name || 'unknown';
  }

  static create(
    twitchClient: TwitchClient,
    config: Config,
    content: string,
    channel: string,
    userstate: ChatUserstate,
  ): ChatTarget {
    const chatMessage = new ChatMessage(
      MessageSanitizationUtil.sanitize(content),
      content.startsWith(config.twitch.commands.prefix),
    );
    const chatRoom = new ChatRoom(twitchClient, channel);
    const chatUser = new ChatUser(twitchClient, userstate.username);

    return new ChatTarget(chatUser, chatRoom, chatMessage);
  }
}
