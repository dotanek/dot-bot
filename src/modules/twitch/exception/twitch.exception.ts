import { Exception } from '../../../core/common/base/exception';

export class TwitchException extends Exception {
  constructor(reason: string) {
    super('TwitchException', `Twitch: ${reason}`);
  }
}
