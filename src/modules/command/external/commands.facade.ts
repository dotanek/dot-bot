import { ChatMessageDto } from './dto/chat-message.dto';
import { CommandsService } from '../core/commands.service';

export interface ICommandsFacade {
  runCommandFor(message: ChatMessageDto): string;
}

export class CommandsFacade implements ICommandsFacade {
  constructor(private readonly service: CommandsService) {}

  runCommandFor(message: ChatMessageDto): string {
    return this.service.runCommandFor(message);
  }
}
