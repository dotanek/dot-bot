import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';
import { TwitchChatService } from '../service/twitch-chat-service';

@ChatCommandHandler({ name: 'ban', aliases: ['banish', 'remove', 'fuckoff'] })
export class BanCommand extends ChatCommandHandlerBase {
  constructor(chatService: TwitchChatService) {
    super(chatService);
  }

  async executeLegacy(command: ChatCommand): Promise<void> {
    const target = command.getArgument(0) ?? command.userName;
    await this._chatService.sendMessage(
      command.channelName,
      `${target} is now banned`,
    );
  }
}
