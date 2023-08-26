import { Command } from './command.base';
import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import {TwitchContext} from "../value-objects/twitch-context";

export class GuguCommand extends Command {
  name = CommandName.GUGU;

  async execute(chatCommand: ChatCommand, twitchContext: TwitchContext): Promise<void> {
    await this.twitchClient.say(twitchContext.room.channel, 'gaga');
  }
}