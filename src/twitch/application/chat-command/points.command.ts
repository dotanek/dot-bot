import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';
import { UserNotFoundTwitchException } from '../exception/user-not-found.twitch-exception';
import { TwitchChatService } from '../service/twitch-chat-service';
import { UserService } from '../service/user.service';

@ChatCommandHandler({ name: 'points', aliases: ['wealth', 'money'] })
export class PointsCommand extends ChatCommandHandlerBase {
  protected _commandTree = {
    handler: (command: ChatCommand, remainingArgs: string[]) =>
      this._handle(command, remainingArgs),
  };

  constructor(
    chatService: TwitchChatService,
    private readonly _userService: UserService,
  ) {
    super(chatService);
  }

  private async _handle(
    command: ChatCommand,
    remainingArgs: string[],
  ): Promise<void> {
    const { userName, channelName } = command;
    const userId = command.messageCtx.userInfo.userId;

    const targetArg = remainingArgs[0]?.replaceAll('@', '');

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
}
