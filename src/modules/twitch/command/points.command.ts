import { Command } from './command.base';
import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { UserRepository } from '../repository/user.repository';
import {
  USER_INIT_SERVICE,
  UserInitService,
} from '../services/user-init.service';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';

export class PointsCommand extends Command {
  private readonly _userInitService: UserInitService;
  private readonly _userRepository: UserRepository;

  constructor() {
    super();
    const dependencyProvider = DependencyProvider.getInstance();

    this._userInitService = dependencyProvider.get(USER_INIT_SERVICE);
    this._userRepository = new UserRepository();
  }

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    if (!twitchContext.user.id) {
      return;
    }

    const user =
      (await this._userRepository.findOneByExternalId(twitchContext.user.id)) ||
      (await this._userInitService.initializeUser(twitchContext.user.id));

    await this._twitchClient.say(
      twitchContext.room.channel,
      `@${twitchContext.user.name}, you have ${user.wealth.value} points.`,
    );
  }

  name = CommandName.POINTS;
}
