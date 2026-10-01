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

@ChatCommandHandler({
  name: 'pp',
  aliases: ['penis', 'benis', 'shlong', 'dingdong'],
})
export class PPCommand extends ChatCommandHandlerBase {
  protected _commandTree = {
    handler: (command: ChatCommand) => this._handleShow(command),
    children: {
      add: {
        handler: (command: ChatCommand) => this._handleAdd(command),
      },
      show: {
        handler: (command: ChatCommand) => this._handleShow(command),
      },
    },
  };

  constructor(
    chatService: TwitchChatService,
    private readonly _userService: UserService,
    private readonly _ppResponseService: PPResponseService,
    private readonly _ppResponseRepository: PPResponseRepository,
  ) {
    super(chatService);
  }

  private async _handleShow(command: ChatCommand): Promise<void> {
    const targetArg = command.getArgument(0)?.replaceAll('@', '');

    if (targetArg && targetArg !== command.userName) {
      await this._handleShowTarget(targetArg, command);
    } else {
      await this._handleShowSelf(command);
    }
  }

  private async _handleShowSelf(command: ChatCommand): Promise<void> {
    const userName = command.userName;

    const response = await this.findResponse(userName);

    let responseStr = `@${command.userName}, `;

    if (response) {
      responseStr += `your pp ${response.content}`;
    } else {
      responseStr += 'I know nothing about your pp :c';
    }

    await this._send(command.channelName, responseStr);
  }

  private async _handleShowTarget(
    targetName: string,
    command: ChatCommand,
  ): Promise<void> {
    const response = await this.findResponse(targetName);

    let responseStr = `@${command.userName}, `;

    if (response) {
      responseStr += `${targetName}s pp ${response.content}`;
    } else {
      responseStr += `I know nothing about ${targetName}s pp :c`;
    }

    await this._send(command.channelName, responseStr);
  }

  private async findResponse(targetName: string): Promise<PPResponse | null> {
    const targetUser = await this._userService.findByName(targetName);

    if (!targetUser) {
      throw new UserNotFoundTwitchException(targetName);
    }

    let response = await this._ppResponseService.findAssigned(targetUser.id);

    if (!response) {
      response = await this._ppResponseService.assignRandom(targetUser.id);
    }

    return response;
  }

  private async _handleAdd(command: ChatCommand): Promise<void> {
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
