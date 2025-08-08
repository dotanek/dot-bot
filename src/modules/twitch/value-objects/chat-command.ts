import { ChatMessage } from './chat-message';
import { CannotCreateChatCommandException } from '../exception/cannot-create-chat-command.exception';
import { InvalidArgumentException } from '../exception/invalid-argument.exception';

export class ChatCommand {
  constructor(
    readonly command: string,
    private readonly args: string[],
  ) {}

  hasArguments(): boolean {
    return this.args.length !== 0;
  }

  getArgument(index: number): string | null {
    return this.args[index] ?? null;
  }

  getArgumentsRange(fromIndex = 0, toIndex?: number): string[] {
    if (fromIndex > this.args.length) {
      throw new InvalidArgumentException(
        `cannot access argument index ${fromIndex} - out of bounds`,
      );
    }

    if (toIndex && toIndex > this.args.length) {
      throw new InvalidArgumentException(
        `cannot access argument index ${toIndex} - out of bounds`,
      );
    }

    return this.args.slice(fromIndex, toIndex);
  }

  static from(chatMessage: ChatMessage): ChatCommand {
    if (!chatMessage.isCommand) {
      throw new CannotCreateChatCommandException(
        'chat message is not a command',
      );
    }

    const [command, ...args] = chatMessage.content.slice(1).split(' ');

    return new ChatCommand(command.toLowerCase(), args);
  }
}
