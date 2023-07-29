import { ChatMessageDto } from '../../external/dto/chat-message.dto';
import { CommandName } from '../enum/command-name.enum';
import { Command } from '../commands/command.base';
import { CommandNotFoundCommandsException } from '../exception/command-not-found.commands-exception';
import { TestCommand, GuguCommand } from '../commands';

export class CommandFactory {
  private commands: Map<CommandName, Command> = new Map<CommandName, Command>(
    [new TestCommand(), new GuguCommand()].map((command) => [
      command.name,
      command,
    ]),
  );

  getFor(message: ChatMessageDto): Command {
    const commandName = message.content
      .slice(1)
      .split(' ')
      .shift()! as CommandName;

    if (!this.commands.has(commandName)) {
      throw new CommandNotFoundCommandsException(commandName);
    }

    return this.commands.get(commandName)!;
  }

  static create(): CommandFactory {
    return new CommandFactory();
  }
}
