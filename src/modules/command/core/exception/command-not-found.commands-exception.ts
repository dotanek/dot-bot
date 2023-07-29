import { CommandsException } from './commands.exception';

export class CommandNotFoundCommandsException extends CommandsException {
  constructor(name: string) {
    super(`command '${name}' not found`);
  }
}