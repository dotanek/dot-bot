import { TwitchException } from './twitch.exception';

export class CannotCreateChatCommandException extends TwitchException {
  constructor(reason: string) {
    super(`cannot create chat command - ${reason}`);
  }
}