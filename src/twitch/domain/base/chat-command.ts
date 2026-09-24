import { Injectable, Logger } from '@nestjs/common';
import { TwitchChatService } from '../../application/service/twitch-chat-service';
import { ChatMessage } from '@twurple/chat';

const WHITESPACE_REGEX = /[\u034F\u200B-\u200D\u2060\uFEFF\u{E0000}]/gu;

export class ChatCommand {
  constructor(
    readonly channelName: string,
    readonly userName: string,
    readonly messageCtx: ChatMessage,
  ) {}

  static create(
    channelName: string,
    userName: string,
    messageCtx: ChatMessage,
  ): ChatCommand {
    return new ChatCommand(channelName, userName, messageCtx);
  }

  get arguments(): string[] {
    return this.messageCtx.text
      .replace(WHITESPACE_REGEX, ' ')
      .trim()
      .split(/\s+/)
      .slice(1);
  }

  get userId(): string {
    return this.messageCtx.userInfo.userId;
  }

  getText(): string {
    return this.messageCtx.text;
  }

  getArgument(index: number): string | undefined {
    return this.arguments[index];
  }

  getArgumentsRange(start: number): string[] {
    return this.arguments.slice(start);
  }

  hasArguments(): boolean {
    return this.arguments.length > 0;
  }
}

export type CommandHandlerMethod = (
  command: ChatCommand,
  args?: string[],
) => Promise<void> | void;

type CommandTree = {
  handler: CommandHandlerMethod;
  children?: Record<string, CommandTree>;
};

@Injectable()
export abstract class ChatCommandHandlerBase {
  protected readonly _logger: Logger = new Logger(ChatCommandHandlerBase.name);

  protected _commandTree?: CommandTree;

  constructor(protected readonly _chatService: TwitchChatService) {}

  abstract executeLegacy(command: ChatCommand): Promise<void> | void;

  /**
   * Searches command tree for the best suited handler and executes it.
   */
  async execute(command: ChatCommand): Promise<void> {
    if (!this._commandTree) {
      await this.executeLegacy(command);

      return;
    }

    const remainingArgs = command.arguments;

    let currentNode = this._commandTree;

    console.log('node: ', currentNode);
    console.log('remaining args: ', remainingArgs);

    while (remainingArgs.length > 0 && currentNode.children) {
      const nextNode = currentNode.children[remainingArgs.shift()!];

      if (nextNode) {
        currentNode = nextNode;
      }
    }

    console.log('node: ', currentNode);

    await currentNode.handler(command, remainingArgs);
  }

  protected async _send(channelName: string, text: string): Promise<void> {
    await this._chatService.sendMessage(channelName, text);
  }
}
