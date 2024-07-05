import { TwitchException } from './twitch.exception';
import { IChattable } from '../interfaces/chattable.interface';

export class UserNotFoundTwitchException
  extends TwitchException
  implements IChattable
{

  readonly chatMessage: string;
  constructor(name: string) {
    super(`user '${name}' does not exist`);

    this.chatMessage = `user not found '${name}'`;
  }
}
