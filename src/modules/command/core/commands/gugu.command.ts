import { Command } from './command.base';
import {CommandName} from "../enum/command-name.enum";

export class GuguCommand extends Command {
  name = CommandName.GUGU;
  execute(): string {
    return 'gaga';
  }
}