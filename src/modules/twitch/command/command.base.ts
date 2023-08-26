import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import {TwitchContext} from "../value-objects/twitch-context";
import {TwitchClient} from "../types/twitch-client";

export abstract class Command {
  constructor(protected readonly twitchClient: TwitchClient) {}

  abstract execute(chatCommand: ChatCommand, twitchContext: TwitchContext): Promise<void>;

  abstract readonly name: CommandName;
}
