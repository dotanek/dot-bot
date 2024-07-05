import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { Command } from './command.base';

export class DiarrheaCommand extends Command {
  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    await this._twitchClient.say(twitchContext.room.channel, 'shit shit shit');
  }

  name = CommandName.DIARRHEA;
}
