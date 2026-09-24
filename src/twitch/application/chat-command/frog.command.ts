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
  constructor(chatService: TwitchChatService) {
    super(chatService);
  }

  async executeLegacy(command: ChatCommand): Promise<void> {
    const userName = command.userName;
    const customResponse = this._customResponses[userName];

    if (customResponse) {
      await this._send(command.channelName, `${userName}, ${customResponse}`);

      return;
    }

    const rangeBottom = 0;
    const rangeTop = 100;
    const integerTrue = true;

    await this._send(
      command.channelName,
      `you are ${RandomProvider.getNumber(rangeBottom, rangeTop, integerTrue)}% frog today 🐸`,
    );
  }

  private readonly _customResponses: Record<string, string> = {
    [People.DOTANEK]: 'you are always and forever 200% frog 🐸',
    [People.SYLVENE]: 'you are 150% frog (are you cheating?!) 🐸',
    [People.TOLL]: 'sir you are a raven >:c',
  };
}
