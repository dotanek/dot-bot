import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { Command } from './command.base';
import { PPResponseRepository } from '../repository/pp-response.repository';
import { RandomGenerator } from '../../../core/random/random-generator';
import { PPResponse } from '../entity/pp-response.entity';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';

const DEFAULT_RESPONSE = 'I know nothing about your pp';

export class PPCommand extends Command {
  name = CommandName.PP;

  private readonly _ppResponseRepository: PPResponseRepository;

  constructor() {
    super();
    this._ppResponseRepository = new PPResponseRepository();
  }

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    if (!chatCommand.hasArguments()) {
      await this._handleNoArgs(twitchContext);
      return;
    }

    if (chatCommand.getArgument(0) === 'add') {
      await this._handleAdd(chatCommand, twitchContext);
      return;
    }
  }

  async _handleNoArgs(twitchContext: TwitchContext): Promise<void> {
    const responses = await this._ppResponseRepository.findVerified();
    const count = responses.length;

    let message = DEFAULT_RESPONSE;

    if (count !== 0) {
      message =
        responses[RandomGenerator.getInstance().getNumberV2(0, count, true)]
          .content;
    }

    await this._twitchClient.say(
      twitchContext.room.channel,
      `@${twitchContext.user.name}, ${message}`,
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
