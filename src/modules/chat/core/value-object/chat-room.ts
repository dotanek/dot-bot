import { TwitchClient } from '../types/twitch-client';

export class ChatRoom {
  constructor(
    private readonly twitchClient: TwitchClient,
    readonly channel: string,
  ) {}

  send(message: string): void {
    this.twitchClient.say(this.channel, message);
  }
}
