import { CommandName } from '../enum/command-name.enum';
import { Command } from '../commands/command.base';
import { CommandNotFoundCommandsException } from '../exception/command-not-found.commands-exception';
import { TestCommand, GuguCommand, LurkCommand } from '../commands';
import { ChatTarget } from '../../../chat/core/value-object/chat-target';

export class ChatCommandFactory {
  private commands: Map<CommandName, Command> = new Map<CommandName, Command>(
    [new TestCommand(), new GuguCommand(), new LurkCommand()].map((command) => [
      command.name,
      command,
    ]),
  );

  getFor(target: ChatTarget): Command {
    const commandName = target
      .getMessageContent()
      .slice(1)
      .split(' ')
      .shift()! as CommandName;

    if (!this.commands.has(commandName)) {
      throw new CommandNotFoundCommandsException(commandName);
    }

    return this.commands.get(commandName)!;
  }

  static create(): ChatCommandFactory {
    return new ChatCommandFactory();
  }
}
