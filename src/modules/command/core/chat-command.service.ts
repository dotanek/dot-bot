import { ChatCommandFactory } from './factory/chatCommandFactory';
import { CommandNotFoundCommandsException } from './exception/command-not-found.commands-exception';
import { ChatTarget } from '../../chat/core/value-object/chat-target';

export class ChatCommandService {
  constructor(private readonly commandFactory: ChatCommandFactory) {}

  runCommandFor(chatTarget: ChatTarget): void {
    try {
      const command = this.commandFactory.getFor(chatTarget);

      command.execute(chatTarget);
    } catch (exception: unknown) {
      if (exception instanceof CommandNotFoundCommandsException) {
        console.log(exception);
      } else {
        throw exception;
      }
    }
  }
}
