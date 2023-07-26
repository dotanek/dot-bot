import { ChatMessageDto } from '../external/dto/chat-message.dto';
import { CommandFactory } from './factory/command.factory';
import { CommandNotFoundCommandsException } from './exception/command-not-found.commands-exception';

export class CommandsService {
  constructor(private readonly commandFactory: CommandFactory) {}

  runCommandFor(message: ChatMessageDto): string {
    try {
      const command = this.commandFactory.getFor(message);

      return command.execute();
    } catch (exception: unknown) {
      if (exception instanceof CommandNotFoundCommandsException) {
        return 'unrecognized command'
      } else {
        throw exception;
      }
    }
  }
}
