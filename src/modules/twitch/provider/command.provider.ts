import { CommandName } from '../enum/command-name.enum';
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

export const COMMAND_PROVIDER = 'command-provider';

export interface ICommandProvider {
  getBy(name: CommandName): Command;
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
];

export class CommandProvider {
  private _commands: Record<string, Command> = {};

  constructor() {
    for (const Command of COMMANDS) {
      const instance = new Command();

      this._commands[instance.name] = instance;
    }
  }

  getBy(name: CommandName): Command {
    const command = this._commands[name];

    if (!command) {
      throw new CommandNotFoundTwitchException(name);
    }

    return command;
  }
}
