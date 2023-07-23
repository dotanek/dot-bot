import { ChatException } from './chat.exception';

export class UnableToConnectChatException extends ChatException {
  constructor(reason: string) {
    super(`unable to connect to chat - '${reason}'`);
  }
}