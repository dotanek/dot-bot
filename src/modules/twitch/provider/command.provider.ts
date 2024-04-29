import { CommandName } from '../enum/command-name.enum';
import { Command } from '../command/command.base';
import { CommandNotFoundCommandsException } from '../exception/command-not-found.commands-exception';
import { GuguCommand, LurkCommand, TestCommand } from '../command';
import { FrogCommand } from '../command/frog.command';
import { BanCommand } from '../command/ban.command';
import { PointsCommand } from '../command/points.command';
import { QuotesCommand } from '../command/quotes.command';

export const COMMAND_PROVIDER = 'command-provider';

export interface ICommandProvider {
  getBy(name: CommandName): Command;
}

const COMMAND_GET_STRATEGY: Partial<Record<CommandName, () => Command>> = {
  [CommandName.GUGU]: () => new GuguCommand(),
  [CommandName.LURK]: () => new LurkCommand(),
  [CommandName.FROG]: () => new FrogCommand(),
  [CommandName.TEST]: () => new TestCommand(),
  [CommandName.BAN]: () => new BanCommand(),
  [CommandName.POINTS]: () => new PointsCommand(),
  [CommandName.QUOTES]: () => new QuotesCommand(),
};

export class CommandProvider {
  getBy(name: CommandName): Command {
    const getter = COMMAND_GET_STRATEGY[name];

    if (!getter) {
      throw new CommandNotFoundCommandsException(name);
    }

    return getter();
  }
}
