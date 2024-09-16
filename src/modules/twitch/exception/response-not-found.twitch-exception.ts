import { TwitchException } from './twitch.exception';

export class ResponseNotFoundTwitchException extends TwitchException {
  constructor(responseId: string) {
    super(`response '${responseId}' not found`);
  }
}
