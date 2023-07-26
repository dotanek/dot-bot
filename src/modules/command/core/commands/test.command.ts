import { Command } from './command.base';

export class TestCommand extends Command {
  execute(): string {
    return 'Hello world!';
  }
}
