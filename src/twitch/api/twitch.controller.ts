import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { TwitchAuthService } from '../application/service/twitch-auth.service';
import { TwitchChatService } from '../application/service/twitch-chat-service';

@Controller('twitch')
export class TwitchController {
  private readonly _logger = new Logger(TwitchController.name);

  constructor(
    private readonly _twitchAuthService: TwitchAuthService,
    private readonly _twitchChatService: TwitchChatService,
  ) {}

  @Get('auth')
  @HttpCode(HttpStatus.CREATED)
  async addToken(
    @Query('code') authCode: string,
  ): Promise<{ message: string }> {
    if (!authCode) {
      throw new BadRequestException('Missing code query parameter');
    }

    try {
      await this._twitchAuthService.addManualToken(authCode);
      this._twitchChatService.connect();
    } catch (exception: unknown) {
      this._logger.error('Failed to manually add token', exception);
    }

    return { message: 'Successfully authenticated, you can close the tab.' };
  }
}
