import { Exception } from '../../../../system-definitions/base/exception';

export class CommandsException extends Exception {
  constructor(reason: string) {
    super('CommandsException', `Commands: ${reason}`);
  }
}
