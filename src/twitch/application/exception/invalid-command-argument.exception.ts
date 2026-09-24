import { IChattable } from '../../domain/interface/chattable';
import { TwitchException } from './twitch.exception';

export class InvalidCommandArgumentException
  extends TwitchException
  implements IChattable
{
  readonly chatMessage: string;

  constructor(reason: string, argument?: string) {
    const message = `invalid command argument ${argument ? "'" + argument + "'" : ''}: ${reason}`;
    super(message);

    this.chatMessage = message;
  }
}
