import { Command } from './command.base';
import {CommandName} from "../enum/command-name.enum";
import {CommandResult} from "../value-objects/command-result";

export class TestCommand extends Command {
  name = CommandName.TEST;
  execute(): CommandResult {
    return CommandResult.createSuccess('Hello world!')
  }
}
