import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';

@ChatCommandHandler({
  name: 'test',
  aliases: ['hello', 'hello-world', 'hi'],
})
export class TestChatCommandHandler extends ChatCommandHandlerBase {
  async execute(command: ChatCommand): Promise<void> {
    await this._chatService.sendMessage(command.channelName, 'Hello world!');
  }
}
