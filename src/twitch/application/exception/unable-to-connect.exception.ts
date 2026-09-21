import { TwitchException } from './twitch.exception';

export class UnableToConnectException extends TwitchException {
  constructor(reason: string) {
    super(`unable to connect to chat - '${reason}'`);
  }
}
