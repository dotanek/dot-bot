import { TwitchException } from './twitch.exception';

export class NullValueException extends TwitchException {
  constructor() {
    super('attempted to access null result value');
  }
}