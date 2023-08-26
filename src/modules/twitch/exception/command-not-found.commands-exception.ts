import { TwitchException } from './twitch.exception';

export class CommandNotFoundCommandsException extends TwitchException {
  constructor(name: string) {
    super(`command '${name}' not found`);
  }
}
