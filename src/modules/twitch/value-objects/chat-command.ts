import { CommandName } from '../enum/command-name.enum';
import { ChatMessage } from './chat-message';
import { CannotCreateChatCommandException } from '../exception/cannot-create-chat-command.exception';
import { IsEnumValidator } from '../../../core/common/validator/is-enum.validator';

export class ChatCommand {
  constructor(
    readonly command: CommandName,
    private readonly args: string[],
  ) {}

  hasArguments(): boolean {
    return this.args.length !== 0;
  }

  getArgument(index: number): string | null {
    return this.args[index] ?? null;
  }

  static from(chatMessage: ChatMessage): ChatCommand {
    if (!chatMessage.isCommand) {
      throw new CannotCreateChatCommandException(
        'chat message is not a command',
      );
    }

    const [command, ...args] = chatMessage.content.slice(1).split(' ');

    if (!new IsEnumValidator(CommandName).check(command)) {
      throw new CannotCreateChatCommandException('invalid command name');
    }

    return new ChatCommand(<CommandName>command, args);
  }
}
