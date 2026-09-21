import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitchException } from '../exception/twitch.exception';
import { TwitchTokenRepository } from '../repository/twitch-token.repository';
import { TwitchToken } from '../entity/twitch-token.entity';
import {
  AccessToken,
  exchangeCode,
  RefreshingAuthProvider,
} from '@twurple/auth';

@Injectable()
export class TwitchAuthService {
  constructor(
    public readonly authProvider: RefreshingAuthProvider,
    private readonly _configService: ConfigService,
    private readonly _tokenRepository: TwitchTokenRepository,
  ) {}

  private async handleOnRefresh(
    userId: string,
    { accessToken, refreshToken, obtainmentTimestamp }: AccessToken,
  ): Promise<void> {
    if (!refreshToken) {
      throw new TwitchException('Missing refresh token');
    }

    await this.updateToken(
      accessToken,
      refreshToken,
      new Date(obtainmentTimestamp),
    );
  }

  private async updateToken(
    accessToken: string,
    refreshToken: string,
    obtainmentDate: Date,
  ): Promise<void> {
    let token = await this._tokenRepository.findOne();

    if (!token) {
      token = TwitchToken.create(accessToken, refreshToken, obtainmentDate);
    } else {
      token.update(accessToken, refreshToken, obtainmentDate);
    }

    await this._tokenRepository.save(token);
  }

  // Added using HTTP callback
  async addManualToken(authCode: string): Promise<void> {
    const clientId = this._configService.getOrThrow<string>(
      'TWITCH__OAUTH_CLIENT_ID',
    );
    const clientSecret = this._configService.getOrThrow<string>(
      'TWITCH__OAUTH_CLIENT_SECRET',
    );
    const redirectUri = this._configService.getOrThrow<string>(
      'TWITCH__OAUTH_REDIRECT_URI',
    );

    const accessToken = await exchangeCode(
      clientId,
      clientSecret,
      authCode,
      redirectUri,
    );

    if (!accessToken.refreshToken) {
      throw new TwitchException('Missing refresh token');
    }

    await this.updateToken(
      accessToken.accessToken,
      accessToken.refreshToken,
      new Date(accessToken.obtainmentTimestamp),
    );

    await this.authProvider.addUserForToken(accessToken);
  }

  static async create(
    configService: ConfigService,
    tokenRepository: TwitchTokenRepository,
  ): Promise<TwitchAuthService> {
    const [clientId, clientSecret] = [
      configService.getOrThrow<string>('TWITCH__OAUTH_CLIENT_ID'),
      configService.getOrThrow<string>('TWITCH__OAUTH_CLIENT_SECRET'),
    ];

    const authProvider = new RefreshingAuthProvider({
      clientId,
      clientSecret,
    });

    const service = new TwitchAuthService(
      authProvider,
      configService,
      tokenRepository,
    );

    authProvider.onRefresh(
      (userId, tokenData) =>
        void service
          .handleOnRefresh(userId, tokenData)
          .catch((error: unknown) => {
            console.error(error);
            throw new TwitchException('Failed to refresh token');
          }),
    );

    const token = await tokenRepository.findOne();

    if (!token) {
      throw new TwitchException('Missing auth token');
    }

    await authProvider.addUserForToken(token.toTwurpleToken(), ['chat']);

    return new TwitchAuthService(authProvider, configService, tokenRepository);
  }
}
