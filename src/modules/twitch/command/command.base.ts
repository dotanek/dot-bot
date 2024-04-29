import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { TwitchClient } from '../types/twitch-client';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';
import { TWITCH_CLIENT } from '../const/twitch-client.key';

export abstract class Command {
  protected readonly _twitchClient: TwitchClient;

  constructor() {
    this._twitchClient = DependencyProvider.getInstance().get(TWITCH_CLIENT);
  }

  abstract execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void>;

  abstract readonly name: CommandName;
}
