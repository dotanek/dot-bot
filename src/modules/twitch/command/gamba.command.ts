import { Command } from './command.base';
import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { IsNumberValidator } from '../../common/validator/is-number.validator';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';

const POINTS_ARG_ALL = 'all';

export class GambaCommand extends Command {
  name = CommandName.GAMBA;

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    const points = await this.getValue(chatCommand.args[0]);
    await this.twitchClient.say(
      twitchContext.room.channel,
      `You trying to gamba for ${points}`,
    );
  }

  private async getValue(pointsArg: string): Promise<number> {
    let stringPoints = pointsArg.slice();

    if (pointsArg.toLowerCase() === POINTS_ARG_ALL) {
      // Fetch all available points here
      return 1;
    }

    let isPercent = false;

    if (pointsArg.includes('%')) {
      isPercent = true;
      stringPoints = stringPoints.slice(0, -1);
    }

    if (!new IsNumberValidator().check(stringPoints)) {
      throw new InvalidCommandArgumentException(this.name, pointsArg);
    }

    if (isPercent) {
      if (+stringPoints <= 0 || +stringPoints > 100) {
        throw new InvalidCommandArgumentException(this.name, pointsArg);
      }

      return 1;
    }

    // Check if points are available

    return +stringPoints;
  }
}
