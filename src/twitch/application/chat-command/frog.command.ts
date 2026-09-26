import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';
import { People } from '../../domain/enum/people.enum';
import { TwitchChatService } from '../service/twitch-chat-service';
import { RandomProvider } from '../../../common/random-provider';

@ChatCommandHandler({ name: 'frog' })
export class FrogCommand extends ChatCommandHandlerBase {
  protected _commandTree = {
    handler: (command: ChatCommand, remainingArgs: string[]) =>
      this._handle(command, remainingArgs),
  };

  constructor(chatService: TwitchChatService) {
    super(chatService);
  }

  private async _handle(
    command: ChatCommand,
    remainingArgs: string[],
  ): Promise<void> {
    const userName = command.userName;

    const targetArg = remainingArgs[0]?.replaceAll('@', '');

    let responseStr = `@${userName},`;

    if (targetArg) {
      responseStr += ` ${targetArg} is ${this._getResponse(targetArg)}`;
    } else {
      responseStr += ` you are ${this._getResponse(userName)}`;
    }

    await this._send(command.channelName, responseStr);
  }

  private _getResponse(targetName: string): string {
    const customResponse = this._customResponses[targetName];

    if (customResponse) {
      return customResponse;
    }

    const rangeBottom = 0;
    const rangeTop = 100;
    const integerTrue = true;

    return `${RandomProvider.getNumber(rangeBottom, rangeTop, integerTrue)}% frog today 🐸`;
  }

  private readonly _customResponses: Record<string, string> = {
    [People.DOTANEK]: 'always and forever 200% frog 🐸',
    [People.SYLVENE]: '150% frog (are you cheating?!) 🐸',
    [People.TOLL]: 'a raven >:c',
  };
}
