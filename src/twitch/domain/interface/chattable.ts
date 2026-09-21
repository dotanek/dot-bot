import { TwitchException } from '../../application/exception/twitch.exception';

export interface IChattable extends TwitchException {
  readonly chatMessage: string;
}

export function isChattable(error: TwitchException): error is IChattable {
  return 'chatMessage' in error;
}
