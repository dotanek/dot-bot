import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatClient } from '@twurple/chat';
import { TwitchAuthService } from './twitch-auth.service';

@Injectable()
export class TwitchChatService implements OnModuleInit {
  private readonly _logger = new Logger(TwitchChatService.name);

  constructor(
    private readonly _chatClient: ChatClient,
    private readonly _twitchAuthService: TwitchAuthService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (await this._twitchAuthService.isAuthenticated()) {
      this.connect();
    } else {
      this._logger.warn('Twitch unauthenticated - chat is not connected');
    }
  }

  async sendMessage(channelId: string, text: string): Promise<void> {
    await this._chatClient.say(channelId, text);
  }

  connect(): void {
    this.chatClient.connect();
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

    return new TwitchChatService(chatClient, twitchAuthService);
  }
}
