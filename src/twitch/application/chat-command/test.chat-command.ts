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
  protected _commandTree = {
    handler: (command: ChatCommand) => this._handleHelloWorld(command),
    children: {
      hello: {
        handler: (command: ChatCommand) => this._handleHello(command),
      },
      world: {
        handler: (command: ChatCommand) => this._handleWorld(command),
      },
    },
  };

  async executeLegacy(command: ChatCommand): Promise<void> {
    await this._chatService.sendMessage(command.channelName, 'Hello world!');
  }

  private async _handleHelloWorld(command: ChatCommand): Promise<void> {
    await this._send(command.channelName, 'Hello world!');
  }

  private async _handleHello(command: ChatCommand): Promise<void> {
    await this._send(command.channelName, 'Hello!');
  }

  private async _handleWorld(command: ChatCommand): Promise<void> {
    await this._send(command.channelName, 'World!');
  }
}
