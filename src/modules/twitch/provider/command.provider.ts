import { CommandName } from '../enum/command-name.enum';
import { Command } from '../command/command.base';
import { GuguCommand, LurkCommand, TestCommand } from '../command';
import { TwitchClient } from '../types/twitch-client';
import { FrogCommand } from '../command/frog.command';
import { QuotesCommand } from '../command/quotes.command';
import database from "../../../database/database";
import {QuoteRepository} from "../repository/quote.repository";

export class CommandProvider {
  private readonly commands: Record<CommandName, () => Promise<Command>>;

  constructor(twitchClient: TwitchClient) {
    this.commands = {
      [CommandName.GUGU]: async () => new GuguCommand(twitchClient),
      [CommandName.TEST]: async () => new TestCommand(twitchClient),
      [CommandName.LURK]: async () => new LurkCommand(twitchClient),
      [CommandName.FROG]: async () => new FrogCommand(twitchClient),
      [CommandName.QUOTES]: async () => new QuotesCommand(twitchClient, new QuoteRepository(await database)),
    };
  }

  getBy(name: CommandName): Promise<Command> {
    return this.commands[name]();
  }
}
