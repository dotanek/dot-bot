import { Command } from './command.base';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { CommandName } from '../enum/command-name.enum';

export class StinkyCommand extends Command {
  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    await this._twitchClient.say(twitchContext.room.channel, `Oh look, it's Toll - the ultra stinker that stinks`)
  }
  name = CommandName.STINKY;
}