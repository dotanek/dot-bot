import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';
import { TwitchChatService } from '../service/twitch-chat-service';
import { UserService } from '../service/user.service';
import { RandomProvider } from '../../../common/random-provider';
import { IsNumberPositiveValidator } from '../../../common/validator/is-number-positive.validator';
import { IsNumberRangeValidator } from '../../../common/validator/is-number-range.validator';
import { UserRepository } from '../repository/user.repository';

const POINTS_ARG_ALL = 'all';

@ChatCommandHandler({
  name: 'gamba',
  aliases: ['gamble', '90percentofgamblersquitrightbeforetheyhititbig'],
})
export class GambaCommand extends ChatCommandHandlerBase {
  protected _commandTree = {
    handler: (command: ChatCommand) => this._handle(command),
  };

  constructor(
    chatService: TwitchChatService,
    private readonly _userService: UserService,
    private readonly _userRepository: UserRepository,
  ) {
    super(chatService);
  }

  private async _handle(command: ChatCommand): Promise<void> {
    const userId = command.messageCtx.userInfo.userId;
    const { userName, channelName } = command;
    const pointsArg = command.getArgument(0);

    if (!pointsArg) {
      throw new InvalidCommandArgumentException('argument is missing');
    }

    const user = await this._userService.findOrCreate(userId, userName);

    if (user.getWealth() <= 0) {
      await this._send(
        channelName,
        `@${userName}, lmao you are literally broke`,
      );

      return;
    }

    const betPoints = this.getValue(pointsArg, user.getWealth());

    const isWin = RandomProvider.getBoolean();

    if (isWin) {
      user.increaseWealth(betPoints);
    } else {
      user.decreaseWealth(betPoints);
    }

    await this._userRepository.save(user);

    await this._send(
      channelName,
      `@${userName} you bet ${betPoints} points and ${
        isWin ? 'won!' : 'lost lmao gottem KEKW'
      } [${user.getWealth()} points]`,
    );
  }

  getValue(pointsArg: string, userPoints: number): number {
    const stringPoints = pointsArg.slice();

    if (pointsArg.toLowerCase() === POINTS_ARG_ALL) {
      return userPoints;
    }

    if (pointsArg.endsWith('%')) {
      return this._getPercent(stringPoints.slice(0, -1), userPoints);
    }

    if (!new IsNumberPositiveValidator().check(stringPoints)) {
      throw new InvalidCommandArgumentException(
        'not a positive number',
        stringPoints,
      );
    }

    return this._getSpecified(pointsArg, userPoints);
  }

  private _getPercent(valueStr: string, points: number): number {
    const rangePercentBottom = 0;
    const rangePercentTop = 100;
    if (
      !new IsNumberRangeValidator(rangePercentBottom, rangePercentTop).check(
        valueStr,
      )
    ) {
      throw new InvalidCommandArgumentException(
        'not a valid percent',
        valueStr,
      );
    }

    return Math.floor(Number(valueStr) * (points / 100));
  }

  private _getSpecified(value: string, points: number): number {
    const parsedValue = Number(value);

    if (parsedValue > points) {
      return points;
    }

    return parsedValue;
  }
}
