import { CommandName } from '../enum/command-name.enum';
import { Command } from '../command/command.base';
import { GuguCommand, LurkCommand, TestCommand } from '../command';
import { TwitchClient } from '../types/twitch-client';
import { FrogCommand } from '../command/frog.command';
import { QuotesCommand } from '../command/quotes.command';
import { QuoteRepository } from '../repository/quote.repository';
import { GambaCommand } from '../command/gamba.command';

import database from '../../../database/database';
import { PointsCommand } from '../command/points.command';
import { UserInitService } from '../services/user-init.service';
import { UserRepository } from '../repository/user.repository';

export class CommandProvider {
  private readonly commands: Record<CommandName, () => Promise<Command>>;

  constructor(
    private readonly twitchClient: TwitchClient,
    private readonly userInitService: UserInitService,
  ) {
    this.commands = {
      [CommandName.GUGU]: async () => new GuguCommand(twitchClient),
      [CommandName.TEST]: async () => new TestCommand(twitchClient),
      [CommandName.LURK]: async () => new LurkCommand(twitchClient),
      [CommandName.FROG]: async () => new FrogCommand(twitchClient),
      [CommandName.QUOTES]: async () =>
        new QuotesCommand(twitchClient, new QuoteRepository(await database)),
      [CommandName.GAMBA]: async () => new GambaCommand(twitchClient),
      [CommandName.POINTS]: async () =>
        new PointsCommand(
          twitchClient,
          new UserRepository(await database),
          userInitService,
        ),
    };
  }

  getBy(name: CommandName): Promise<Command> {
    return this.commands[name]();
  }
}
