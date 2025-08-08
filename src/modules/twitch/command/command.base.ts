import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { TwitchClient } from '../types/twitch-client';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';
import { TWITCH_CLIENT } from '../const/twitch-client.key';

export abstract class Command {
  abstract readonly name: string;
  abstract readonly aliases: string[];

  protected readonly _twitchClient: TwitchClient;

  constructor() {
    this._twitchClient = DependencyProvider.getInstance().get(TWITCH_CLIENT);
  }

  abstract execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void>;
}
