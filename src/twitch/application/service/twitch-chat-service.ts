import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatClient } from '@twurple/chat';
import { TwitchAuthService } from './twitch-auth.service';

@Injectable()
export class TwitchChatService {
  constructor(
    private readonly _chatClient: ChatClient,
    private readonly _configService: ConfigService,
    private readonly _twitchAuthService: TwitchAuthService,
  ) {}

  async sendMessage(channelId: string, text: string): Promise<void> {
    await this._chatClient.say(channelId, text);
  }

  get chatClient() {
    return this._chatClient;
  }

  static create(
    configService: ConfigService,
    twitchAuthService: TwitchAuthService,
  ): TwitchChatService {
    const [channel] = [
      configService.getOrThrow<string>('TWITCH__CHANNEL'),
      configService.getOrThrow<string>('TWITCH__PREFIX'),
    ];

    const chatClient = new ChatClient({
      authProvider: twitchAuthService.authProvider,
      channels: [channel],
    });

    chatClient.connect();

    return new TwitchChatService(chatClient, configService, twitchAuthService);
  }
}
