import { Command } from './command.base';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { People } from '../enum/people.enum';

export class FrogCommand extends Command {
  readonly name = 'frog'
  readonly aliases = ['frog'];

  private readonly responses: Record<string, () => string> = {
    [People.DOTANEK]: () => `you are always and forever 200% frog 🐸`,
    [People.CHILLED]: () => `you are 150% frog (are you cheating?!) 🐸`,
    [People.TOLL]: () => `sir you are a raven >:c`,
    [People.KATAETO]: () => `you are ${this.getRandomPercent()+50}% frog today 🐸`,
    default: () => `you are ${this.getRandomPercent()}% frog today 🐸`,
  };

  async execute(chatCommand: ChatCommand, twitchContext: TwitchContext): Promise<void> {
    const username = twitchContext.user.name;
    const response = (this.responses[username] || this.responses.default)();

    await this._twitchClient.say(
      twitchContext.room.channel,
      `${username}, ${response}`,
    );
  }

  private getRandomPercent(): number {
    return Math.floor(Math.random() * 100);
  }
}
