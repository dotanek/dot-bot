import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';
import { TwitchChatService } from '../service/twitch-chat-service';

@ChatCommandHandler({ name: 'lurk' })
export class LurkCommand extends ChatCommandHandlerBase {
  constructor(chatService: TwitchChatService) {
    super(chatService);
  }

  async executeLegacy(command: ChatCommand): Promise<void> {
    await this._chatService.sendMessage(
      command.channelName,
      `${command.userName} is chillin in the pond, thank you for the lurk!`,
    );
  }
}
