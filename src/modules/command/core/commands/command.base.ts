import { CommandName } from '../enum/command-name.enum';
import { CommandResult } from '../value-objects/command-result';

export abstract class Command {
  abstract execute(): CommandResult;

  abstract readonly name: CommandName;

  protected toFailure(reason: string): CommandResult {
    return CommandResult.createFailure(`error: ${reason}`);
  }
}
