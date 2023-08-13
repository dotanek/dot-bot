import { TwitchClient } from '../types/twitch-client';

export class ChatUser {
  constructor(
    private readonly twitchClient: TwitchClient,
    readonly name: string | undefined,
  ) {}
}
