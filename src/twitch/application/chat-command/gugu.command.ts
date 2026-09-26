import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';
import { TwitchChatService } from '../service/twitch-chat-service';

@ChatCommandHandler({ name: 'gugu' })
export class GuguCommand extends ChatCommandHandlerBase {
  protected _commandTree = {
    handler: (command: ChatCommand) => this._handle(command),
  };

  constructor(chatService: TwitchChatService) {
    super(chatService);
  }

  private async _handle(command: ChatCommand): Promise<void> {
    await this._chatService.sendMessage(command.channelName, 'gaga');
  }
}
