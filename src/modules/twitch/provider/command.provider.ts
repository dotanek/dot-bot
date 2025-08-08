import {
  Command,
  BanCommand,
  DiarrheaCommand,
  FrogCommand,
  GambaCommand,
  GuguCommand,
  LurkCommand,
  PointsCommand,
  PPCommand,
  QuotesCommand,
  StinkyCommand,
  TestCommand,
} from '../command';
import { CommandNotFoundTwitchException } from '../exception/command-not-found.twitch-exception';
import { LoveCommand } from '../command/love.command';
import { CommandInitException } from '../exception/command-init.exception';

export const COMMAND_PROVIDER = 'command-provider';

export interface ICommandProvider {
  getBy(name: string): Command;
}

const COMMANDS: { new (): Command }[] = [
  BanCommand,
  DiarrheaCommand,
  FrogCommand,
  GambaCommand,
  GuguCommand,
  LurkCommand,
  PointsCommand,
  PPCommand,
  QuotesCommand,
  StinkyCommand,
  TestCommand,
  LoveCommand,
];

export class CommandProvider implements ICommandProvider {
  private commandHashMap: Record<string, Command> = {};

  constructor() {
    for (const Command of COMMANDS) {
      const instance = new Command();

      for (const alias of instance.aliases) {
        if (this.commandHashMap[alias]) {
          throw new CommandInitException(
            `command with alias '${alias}' is already registered`,
          );
        }

        this.commandHashMap[alias] = instance;
      }
    }
  }

  getBy(token: string): Command {
    const command = this.commandHashMap[token];

    if (!command) {
      throw new CommandNotFoundTwitchException(token);
    }

    return command;
  }
}
