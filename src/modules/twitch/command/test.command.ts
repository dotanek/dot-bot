import { Command } from './command.base';
import { CommandName } from '../enum/command-name.enum';
import {TwitchContext} from "../value-objects/twitch-context";
import {ChatCommand} from "../value-objects/chat-command";

export class TestCommand extends Command {
  name = CommandName.TEST;

  async execute(chatTarget: ChatCommand, twitchContext: TwitchContext): Promise<void> {
    console.log(twitchContext);
    await this.twitchClient.say(twitchContext.room.channel, 'Hello world!');
  }
}
