import { Command } from './command.base';
import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';
import { UserRepository } from '../repository/user.repository';
import { IUserService, USER_SERVICE } from '../services/user.service';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';
import { InvalidUserException } from '../exception/invalid-user.exception';
import { IsPercentValidator } from '../../../core/common/validator/is-percent.validator';
import { IsPositiveNumberValidator } from '../../../core/common/validator/is-positive-number.validator';
import { RandomGenerator } from '../../../core/random/random-generator';

const POINTS_ARG_ALL = 'all';

export class GambaCommand extends Command {
  name = CommandName.GAMBA;

  private readonly _userRepository = new UserRepository();
  private readonly _userService: IUserService =
    DependencyProvider.getInstance().get(USER_SERVICE);

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    const externalId = twitchContext.user.id;
    const pointsArg = chatCommand.getArgument(0);

    if (!externalId) {
      throw new InvalidUserException('user has no external id');
    }

    if (!pointsArg) {
      throw new InvalidCommandArgumentException(this.name, 'points');
    }

    const user = await this._userService.findOrCreate(externalId, twitchContext.user.name);
    const points = await this.getValue(pointsArg, user.getWealth());

    const isWin = RandomGenerator.getInstance().getNumber() > 0;

    if (isWin) {
      user.increaseWealth(points);
    } else {
      user.decreaseWealth(points);
    }

    await this._userRepository.save(user);

    await this._twitchClient.say(
      twitchContext.room.channel,
      `@${twitchContext.user.name} you bet ${points} points and ${
        isWin ? 'won!' : 'lost lmao gottem KEKW'
      } [${user.getWealth()} points]`,
    );
  }

  private async getValue(
    pointsArg: string,
    userPoints: number,
  ): Promise<number> {
    // TODO add random gamba

    const stringPoints = pointsArg.slice();

    if (pointsArg.toLowerCase() === POINTS_ARG_ALL) {
      return userPoints;
    }

    if (pointsArg.includes('%')) {
      return this._getPercent(stringPoints.slice(0, -1), userPoints);
    }

    if (!new IsPositiveNumberValidator().check(stringPoints)) {
      throw new InvalidCommandArgumentException(
        this.name,
        pointsArg,
        'not a positive number',
      );
    }

    return this._getSpecified(pointsArg, userPoints);
  }

  private _getPercent(value: string, points: number): number {
    if (!new IsPercentValidator().check(value)) {
      throw new InvalidCommandArgumentException(
        this.name,
        value,
        'not a valid percent',
      );
    }

    return Math.floor(+value * (points / 100));
  }

  private _getSpecified(value: string, points: number): number {
    const parsedValue = +value;

    if (parsedValue > points) {
      return points;
    }

    return parsedValue;
  }
}
