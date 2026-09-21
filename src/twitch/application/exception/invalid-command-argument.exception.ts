import { IChattable } from '../../domain/interface/chattable';
import { TwitchException } from './twitch.exception';

export class InvalidCommandArgumentException
  extends TwitchException
  implements IChattable
{
  readonly chatMessage: string;

  constructor(commandName: string, argument: string, reason?: string) {
    super(`command '${commandName}' argument '${argument}' invalid`);

    this.chatMessage = `invalid argument '${argument}'${
      reason ? ' - ' + reason : ''
    }`;
  }
}
