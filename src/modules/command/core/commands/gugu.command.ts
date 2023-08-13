import { Command } from './command.base';
import {CommandName} from "../enum/command-name.enum";
import {CommandResult} from "../value-objects/command-result";

export class GuguCommand extends Command {
  name = CommandName.GUGU;
  execute(): CommandResult {
    return CommandResult.createSuccess('gaga');
  }
}