import { Controller, Get, Query } from '@nestjs/common';
import { TwitchAuthService } from '../application/service/twitch-auth.service';

@Controller('twitch')
export class TwitchController {
  constructor(private readonly _twitchAuthService: TwitchAuthService) {}

  @Get('auth')
  async addToken(@Query('code') authCode: string): Promise<void> {
    await this._twitchAuthService.addManualToken(authCode);
  }
}
