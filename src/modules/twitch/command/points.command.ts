import { Command } from './command.base';
import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { UserRepository } from '../repository/user.repository';
import { USER_SERVICE, UserService } from '../services/user.service';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';
import { UserNotFoundTwitchException } from '../exception/user-not-found.twitch-exception';
import { IsNumberValidator } from '../../../core/common/validator/is-number.validator';

export class PointsCommand extends Command {
  private readonly _userService: UserService;
  private readonly _userRepository: UserRepository;

  constructor() {
    super();
    const dependencyProvider = DependencyProvider.getInstance();

    this._userService = dependencyProvider.get(USER_SERVICE);
    this._userRepository = new UserRepository();
  }

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    if (!chatCommand.hasArguments()) {
      return this._handleNoArg(twitchContext);
    }

    await this._handleSet(chatCommand, twitchContext);
  }

  name = CommandName.POINTS;

  private async _handleNoArg(twitchContext: TwitchContext): Promise<void> {
    if (!twitchContext.user.id) {
      return;
    }

    const user = await this._userService.findOrCreate(twitchContext.user.id, twitchContext.user.name);

    await this._twitchClient.say(
      twitchContext.room.channel,
      `@${twitchContext.user.name}, you have ${user.wealth.value} points.`,
    );
  }

  private _handleAdd(): void {}

  private _handleRemove(): void {}

  private async _handleSet(chatCommand: ChatCommand, twitchContext: TwitchContext): Promise<void> {
    if (!twitchContext.user.mod) {
      return;
    }

    const userArg = chatCommand.getArgument(1);

    if (!userArg) {
      throw new InvalidCommandArgumentException(this.name, 'username');
    }

    const pointsArg = chatCommand.getArgument(2);

    if (!pointsArg) {
      throw new InvalidCommandArgumentException(this.name, 'points');
    }

    if (!new IsNumberValidator().check(pointsArg)) {
      throw new InvalidCommandArgumentException(this.name, pointsArg, `not a number`)
    }

    const user = await this._userService.findByName(userArg);

    if (!user) {
      throw new UserNotFoundTwitchException(userArg);
    }

    user.setWealth(+pointsArg);

    await this._userRepository.save(user);
  }
}
