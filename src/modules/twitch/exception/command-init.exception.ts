import { TwitchException } from './twitch.exception';

export class CommandInitException extends TwitchException {
  constructor(reason: string) {
    super(`could not initialize commands - ${reason}`);
  }

  name = CommandInitException.name;
}
