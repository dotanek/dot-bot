import {CommandName} from "../enum/command-name.enum";

export abstract class Command {
  abstract execute(): string;
  abstract readonly name: CommandName;

  protected toFailure(reason: string): string {
    return `error: ${reason}`;
  }
}
