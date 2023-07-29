import { Command } from './command.base';
import {CommandName} from "../enum/command-name.enum";

export class TestCommand extends Command {
  name = CommandName.TEST;
  execute(): string {
    return 'Hello world!';
  }
}
