import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { Command } from './command.base';

export class BanCommand extends Command {
  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    let target = chatCommand.args[0];

    if (!target) {
      target = twitchContext.user.name;
    }

    await this._twitchClient.say(twitchContext.room.channel, `${target} is now banned`)
  }
  name: CommandName;
}