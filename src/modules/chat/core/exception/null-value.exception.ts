import {CommandsException} from "../../../command/core/exception/commands.exception";

export class NullValueException extends CommandsException {
  constructor() {
    super('attempted to access null result value');
  }
}