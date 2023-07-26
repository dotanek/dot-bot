import { Command } from './command.base';

export class GuguCommand extends Command {
  execute(): string {
    return 'gaga';
  }
}