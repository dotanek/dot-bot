import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { Command } from './command.base';
import { PPResponseRepository } from '../repository/pp-response.repository';
import { PPResponse } from '../entity/pp-response.entity';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';
import {
  PP_RESPONSE_SERVICE,
  PPResponseService,
} from '../services/pp-response.service';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';
import { USER_SERVICE, UserService } from '../services/user.service';
import { UserNotFoundTwitchException } from '../exception/user-not-found.twitch-exception';

const DEFAULT_RESPONSE = 'I know nothing about your pp';

enum SubCommand {
  ADD = 'add',
}

export class PPCommand extends Command {
  name = CommandName.PP;

  private readonly _ppResponseRepository: PPResponseRepository;
  private readonly _ppResponseService: PPResponseService;
  private readonly _userService: UserService;

  constructor() {
    super();
    this._ppResponseRepository = new PPResponseRepository();
    this._userService = DependencyProvider.getInstance().get(USER_SERVICE);
    this._ppResponseService =
      DependencyProvider.getInstance().get(PP_RESPONSE_SERVICE);
  }

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    if (!chatCommand.hasArguments()) {
      return await this._handleNoArgs(twitchContext);
    }

    if (chatCommand.getArgument(0) === SubCommand.ADD) {
      return await this._handleAdd(chatCommand, twitchContext);
    }
  }

  async _handleNoArgs(twitchContext: TwitchContext): Promise<void> {
    if (!twitchContext.user.id) {
      return;
    }

    const user = await this._userService.findOrCreate(
      twitchContext.user.id,
      twitchContext.user.name,
    );

    if (!user) {
      throw new UserNotFoundTwitchException(twitchContext.user.name);
    }

    let response = await this._ppResponseService.findAssigned(user.id);

    if (!response) {
      response = await this._ppResponseService.findRandomVerified();

      if (response) {
        await this._ppResponseService.assign(user.id, response.id);
      }
    }

    await this._twitchClient.say(
      twitchContext.room.channel,
      `@${twitchContext.user.name}, ${response?.content ?? DEFAULT_RESPONSE}`,
    );
  }

  async _handleAdd(
    chatCommant: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    const contentArgs = chatCommant.getArgumentsRange(1);

    if (contentArgs.length === 0) {
      throw new InvalidCommandArgumentException(this.name, 'content');
    }

    const response = PPResponse.create(contentArgs.join(' '), false);
    await this._ppResponseRepository.save(response);

    await this._twitchClient.say(
      twitchContext.room.channel,
      `@${twitchContext.user.name}, pp response suggested (awaiting approval)`,
    );
  }
}
