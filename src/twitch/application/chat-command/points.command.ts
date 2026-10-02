import { IsNumberPositiveValidator } from '../../../common/validator/is-number-positive.validator';
import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';
import { UserNotFoundTwitchException } from '../exception/user-not-found.twitch-exception';
import { UserRepository } from '../repository/user.repository';
import { TwitchChatService } from '../service/twitch-chat-service';
import { UserService } from '../service/user.service';

@ChatCommandHandler({ name: 'points', aliases: ['wealth', 'money'] })
export class PointsCommand extends ChatCommandHandlerBase {
  protected _commandTree = {
    handler: (command: ChatCommand, remainingArgs: string[]) =>
      this._handle(command, remainingArgs),
    children: {
      add: {
        handler: (command: ChatCommand, remainingArgs: string[]) =>
          this._handleAdd(command, remainingArgs),
      },
    },
  };

  constructor(
    chatService: TwitchChatService,
    private readonly _userService: UserService,
    private readonly _userRepository: UserRepository,
  ) {
    super(chatService);
  }

  private async _handle(
    command: ChatCommand,
    remainingArgs: string[],
  ): Promise<void> {
    const { userName, channelName } = command;
    const userId = command.messageCtx.userInfo.userId;

    const targetArg = remainingArgs[0]?.replaceAll('@', '').toLowerCase();

    if (targetArg) {
      await this._handleTarget(targetArg, userName, channelName);
    } else {
      await this._handleSelf(userId, userName, channelName);
    }
  }

  private async _handleSelf(
    userId: string,
    userName: string,
    channelName: string,
  ): Promise<void> {
    const user = await this._userService.findOrCreate(userId, userName);

    await this._send(
      channelName,
      `@${userName}, you have ${user.getWealth()} points`,
    );
  }

  private async _handleTarget(
    targetName: string,
    userName: string,
    channelName: string,
  ): Promise<void> {
    const targetUser = await this._userService.findByName(targetName);

    let responseStr: string;

    if (targetUser) {
      responseStr = `@${userName}, ${targetName} has ${targetUser.getWealth()} points`;
    } else {
      throw new UserNotFoundTwitchException(targetName);
    }

    await this._send(channelName, responseStr);
  }

  private async _handleAdd(
    command: ChatCommand,
    remainingArgs: string[],
  ): Promise<void> {
    const userInfo = command.messageCtx.userInfo;
    if (!(userInfo.isBroadcaster || userInfo.isMod)) {
      return;
    }

    const targetArg = remainingArgs[0]?.replaceAll('@', '').toLowerCase();
    const valueArg = remainingArgs[1];

    if (!targetArg) {
      throw new InvalidCommandArgumentException('missing target argument');
    }

    if (!valueArg) {
      throw new InvalidCommandArgumentException('missing value argument');
    }

    if (!new IsNumberPositiveValidator().check(valueArg)) {
      throw new InvalidCommandArgumentException(
        'value is not a positive number',
        valueArg,
      );
    }

    const targetUser = await this._userService.findByName(targetArg);

    if (!targetUser) {
      throw new UserNotFoundTwitchException(targetArg);
    }

    targetUser.increaseWealth(Number(valueArg));

    await this._userRepository.save(targetUser);

    await this._send(
      command.channelName,
      `${command.userName}, increased ${targetArg}s points [${targetUser.getWealth()}]`,
    );
  }
}
