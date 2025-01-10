import { ChatUserstate } from 'tmi.js';
import { TwitchUserMetadataNotDefinedTwitchException } from '../exception/twitch-user-metadata-not-defined.twitch-exception';

export class TwitchUser {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly mod: boolean,
  ) {}

  static create(userstate: ChatUserstate): TwitchUser {
    const userId = userstate['user-id'];
    const userName = userstate.username;

    if (!userId || !userName) {
      throw new TwitchUserMetadataNotDefinedTwitchException();
    }

    return new TwitchUser(userId, userName, _isMod(userstate));
  }
}

function _isMod(userstate: ChatUserstate): boolean {
  return !!userstate.badges?.broadcaster || !!userstate.badges?.moderator;
}
