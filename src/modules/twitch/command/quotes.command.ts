import { Command } from './command.base';
import { CommandName } from '../enum/command-name.enum';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { QuoteRepository } from '../repository/quote.repository';
import { TwitchClient } from '../types/twitch-client';

export class QuotesCommand extends Command {
  readonly name = CommandName.QUOTES;

  constructor(
    twitchClient: TwitchClient,
    private readonly quoteRepository: QuoteRepository,
  ) {
    super(twitchClient);
  }

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    const quotesCount = await this.quoteRepository.count();

    await this.twitchClient.say(
      twitchContext.room.channel,
      `There are currently ${quotesCount} quotes saved.`,
    );
  }
}