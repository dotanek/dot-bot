import { TwitchException } from './twitch.exception';

export class CommandNotFoundTwitchException extends TwitchException {
  constructor(name: string) {
    super(`command '${name}' not found`);
  }
}
