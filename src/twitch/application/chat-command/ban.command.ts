import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';
import { TwitchChatService } from '../service/twitch-chat-service';

@ChatCommandHandler({ name: 'ban', aliases: ['banish', 'remove', 'fuckoff'] })
export class BanCommand extends ChatCommandHandlerBase {
  protected _commandTree = {
    handler: (command: ChatCommand) => this._handle(command),
  };

  constructor(chatService: TwitchChatService) {
    super(chatService);
  }

  private async _handle(command: ChatCommand): Promise<void> {
    const target = command.getArgument(0) ?? command.userName;
    await this._send(command.channelName, `${target} is now banned`);
  }
}
