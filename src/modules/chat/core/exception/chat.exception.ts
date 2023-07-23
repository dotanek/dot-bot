import { Exception } from '../../../../system-definitions/base/exception';

export class ChatException extends Exception {
  constructor(reason: string) {
    super('ChatException', `Chat: ${reason}`);
  }
}
