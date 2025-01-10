import { TwitchUser } from './twitch-user';
import { ChatRoom } from './chat-room';
import { ChatUserstate } from 'tmi.js';

export class TwitchContext {
  constructor(
    readonly user: TwitchUser,
    readonly room: ChatRoom,
  ) {}

  static create(channel: string, userstate: ChatUserstate): TwitchContext {
    const chatRoom = new ChatRoom(channel);
    const chatUser = TwitchUser.create(userstate);

    return new TwitchContext(chatUser, chatRoom);
  }
}
