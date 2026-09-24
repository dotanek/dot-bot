import { TwitchException } from './twitch.exception';

export class TwitchUserMetadataNotDefinedTwitchException extends TwitchException {
  constructor() {
    super(`twitch user metadata is not defined`);
  }
}
