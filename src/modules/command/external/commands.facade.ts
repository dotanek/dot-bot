import { ChatMessageDto } from './dto/chat-message.dto';
import { CommandsService } from '../core/commands.service';

export class CommandsFacade {
  constructor(private readonly service: CommandsService) {}

  runCommandFor(message: ChatMessageDto): string {
    return this.service.runCommandFor(message);
  }
}
