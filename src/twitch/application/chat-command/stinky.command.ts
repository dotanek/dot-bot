import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';
import { TwitchChatService } from '../service/twitch-chat-service';

@ChatCommandHandler({
  name: 'stinky',
  aliases: ['smelly', 'toll', 'tolltheravens'],
})
export class StinkyCommand extends ChatCommandHandlerBase {
  constructor(chatService: TwitchChatService) {
    super(chatService);
  }

  async executeLegacy(command: ChatCommand): Promise<void> {
    await this._chatService.sendMessage(
      command.channelName,
      `Oh look, it's Toll - the ultra stinker that stinks`,
    );
  }
}
