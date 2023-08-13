import { ChatMessageDto } from '../external/dto/chat-message.dto';
import { ChatCommandFactory } from './factory/chatCommandFactory';
import { CommandNotFoundCommandsException } from './exception/command-not-found.commands-exception';
import {CommandResult} from "./value-objects/command-result";

export class ChatCommandService {
  constructor(private readonly commandFactory: ChatCommandFactory) {}

  runCommandFor(message: ChatMessageDto): CommandResult {
    try {
      const command = this.commandFactory.getFor(message);

      return command.execute();
    } catch (exception: unknown) {
      if (exception instanceof CommandNotFoundCommandsException) {
        return CommandResult.createFailure('command not found');
      } else {
        throw exception;
      }
    }
  }
}
