import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';
import { PPResponse } from '../entity/pp-response.entity';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';
import { UserNotFoundTwitchException } from '../exception/user-not-found.twitch-exception';
import { PPResponseRepository } from '../repository/pp-response.repository';
import { PPResponseService } from '../service/pp-response.service';
import { TwitchChatService } from '../service/twitch-chat-service';
import { UserService } from '../service/user.service';

enum SubCommand {
  ADD = 'add',
}

@ChatCommandHandler({
  name: 'pp',
  aliases: ['penis', 'benis', 'shlong', 'dingdong'],
})
export class PPCommand extends ChatCommandHandlerBase {
  constructor(
    chatService: TwitchChatService,
    private readonly _userService: UserService,
    private readonly _ppResponseService: PPResponseService,
    private readonly _ppResponseRepository: PPResponseRepository,
  ) {
    super(chatService);
  }

  async executeLegacy(command: ChatCommand): Promise<void> {
    const argumentStr = command.getArgument(0);

    if (argumentStr === SubCommand.ADD) {
      await this._handleAdd(command);
    } else {
      await this._handleShow(command);
    }
  }

  private async _handleShow(command: ChatCommand): Promise<void> {
    const targetName = command.getArgument(1);

    if (targetName) {
      await this._handleShowTarget(targetName, command);
    } else {
      await this._handleShowSelf(command);
    }
  }

  private async _handleShowSelf(command: ChatCommand): Promise<void> {
    let response = await this._ppResponseService.findAssigned(command.userId);

    if (!response) {
      response = await this._ppResponseService.assignRandom(command.userId);
    }

    let responseStr = `@${command.userName}, `;

    if (response) {
      responseStr += response.content;
    } else {
      responseStr += 'I know nothing about your pp :c';
    }
    await this._send(command.channelName, responseStr);
  }

  private async _handleShowTarget(
    targetName: string,
    command: ChatCommand,
  ): Promise<void> {
    const targetUser = await this._userService.findByName(targetName);

    if (!targetUser) {
      throw new UserNotFoundTwitchException(targetName);
    }

    let response = await this._ppResponseService.findAssigned(targetUser.id);

    if (!response) {
      response = await this._ppResponseService.assignRandom(targetUser.id);
    }

    let responseStr = `@${command.userName}, `;

    if (response) {
      responseStr += `${targetName}s pp is blah blah blah`;
    } else {
      responseStr += `I know nothing about ${targetName} pp :c`;
    }

    await this._send(command.channelName, responseStr);
  }

  async _handleAdd(command: ChatCommand): Promise<void> {
    const contentArgs = command.getArgumentsRange(1);

    if (contentArgs.length === 0) {
      throw new InvalidCommandArgumentException('quote cotnent is missing');
    }

    const response = PPResponse.create(contentArgs.join(' ').trim());
    await this._ppResponseRepository.save(response);

    await this._send(
      command.channelName,
      `@${command.userName}, pp response suggested (awaiting approval)`,
    );
  }
}
