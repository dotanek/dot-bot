import {Command} from "./command.base";
import {CommandName} from "../enum/command-name.enum";
import {ChatTarget} from "../../../chat/core/value-object/chat-target";

export class LurkCommand extends Command {
  readonly name = CommandName.LURK;

  execute(chatTarget: ChatTarget): void {
    chatTarget.send(`${chatTarget.getUserName()} is chillin in the pond, thank you for the lurk!`)
  }
}