import { TwitchException } from './twitch.exception';

export class InvalidCommandArgumentException extends TwitchException {
  constructor(commandName: string, argument: string) {
    super(`command '${commandName}' argument '${argument}' invalid`);
  }
}
