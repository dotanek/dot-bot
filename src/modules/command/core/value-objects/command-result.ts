import {NullValueException} from "../../../chat/core/exception/null-value.exception";

export class CommandResult {
  constructor(
    readonly success: boolean,
    readonly value: string | null,
    readonly error: string | null,
  ) {}

  getValueOrThrow(): string {
    if (!this.value) {
      throw new NullValueException();
    }

    return this.value;
  }

  static createSuccess(value: string): CommandResult {
    return new CommandResult(true, value, null);
  }

  static createFailure(error: string): CommandResult {
    return new CommandResult(false, null, error);
  }
}
