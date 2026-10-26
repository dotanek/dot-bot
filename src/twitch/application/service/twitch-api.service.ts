import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ApiClient, HelixUser } from '@twurple/api';
import { TwitchAuthService } from './twitch-auth.service';

@Injectable()
export class TwitchApiService implements OnModuleInit {
  private readonly _logger = new Logger(TwitchApiService.name);

  constructor(
    private readonly _apiClient: ApiClient,
    private readonly _twitchAuthService: TwitchAuthService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!(await this._twitchAuthService.isAuthenticated())) {
      this._logger.warn('Twitch unauthenticated - API calls will fail');
    }
  }

  async findUserById(userId: string): Promise<HelixUser | null> {
    return this._apiClient.users.getUserById(userId);
  }

  async findUserByName(userName: string): Promise<HelixUser | null> {
    return this._apiClient.users.getUserByName(userName);
  }

  get apiClient(): ApiClient {
    return this._apiClient;
  }

  static create(twitchAuthService: TwitchAuthService): TwitchApiService {
    const apiClient = new ApiClient({
      authProvider: twitchAuthService.authProvider,
    });

    return new TwitchApiService(apiClient, twitchAuthService);
  }
}
