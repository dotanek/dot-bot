import { ChatMessageDto } from '../../external/dto/chat-message.dto';
import { CommandName } from '../enum/command-name.enum';
import { Command } from '../commands/command.base';
import { TestCommand } from '../commands/test.command';
import { CommandNotFoundCommandsException } from '../exception/command-not-found.commands-exception';
import {GuguCommand} from "../commands/gugu.command";

export class CommandFactory {
  private commands: Record<string, Command> = {
    [CommandName.TEST]: new TestCommand(),
    [CommandName.GUGU]: new GuguCommand(),
  };

  getFor(message: ChatMessageDto): Command {
    const commandName = message.content.slice(1).split(' ').shift()!;

    const command = this.commands[commandName];

    if (command === undefined) {
      throw new CommandNotFoundCommandsException(commandName);
    }

    return command;
  }

  static create(): CommandFactory {
    return new CommandFactory();
  }
}
