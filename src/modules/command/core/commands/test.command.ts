import { Command } from './command.base';
import { CommandName } from '../enum/command-name.enum';
import {ChatTarget} from "../../../chat/core/value-object/chat-target";

export class TestCommand extends Command {
  name = CommandName.TEST;

  execute(chatTarget: ChatTarget): void {
    chatTarget.send('Hello world!')
  }
}
