import { Exception } from '../../../system-definitions/base/exception';

export class TwitchException extends Exception {
  constructor(reason: string) {
    super('TwitchException', `Twitch: ${reason}`);
  }
}
