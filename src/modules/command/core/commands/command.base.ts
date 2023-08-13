import { CommandName } from '../enum/command-name.enum';
import {ChatTarget} from "../../../chat/core/value-object/chat-target";

export abstract class Command {
  abstract execute(chatTarget: ChatTarget): void;

  abstract readonly name: CommandName;
}
