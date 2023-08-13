import { Command } from './command.base';
import {CommandName} from "../enum/command-name.enum";
import {ChatTarget} from "../../../chat/core/value-object/chat-target";

export class GuguCommand extends Command {
  name = CommandName.GUGU;
  execute(chatTarget: ChatTarget): void {
    chatTarget.send('gaga');
  }
}