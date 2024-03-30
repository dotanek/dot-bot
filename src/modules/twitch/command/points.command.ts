import { Command } from './command.base';
import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { TwitchClient } from '../types/twitch-client';
import { UserRepository } from '../repository/user.repository';
import { UserInitService } from '../services/user-init.service';

export class PointsCommand extends Command {
  constructor(
    twitchClient: TwitchClient,
    private readonly userRepository: UserRepository,
    private readonly userInitService: UserInitService,
  ) {
    super(twitchClient);
  }

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    if (!twitchContext.user.id) {
      return;
    }

    const user =
      (await this.userRepository.findOneByExternalId(twitchContext.user.id)) ||
      (await this.userInitService.initializeUser(twitchContext.user.id));

    await this.twitchClient.say(twitchContext.room.channel, `@${twitchContext.user.name}, you have ${user.wealth.value} points.`);
  }

  name = CommandName.POINTS;
}
