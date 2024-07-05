import { TwitchException } from './twitch.exception';

export class InvalidUserException extends TwitchException {
  constructor(reason: string) {
    super(reason);
  }
}
