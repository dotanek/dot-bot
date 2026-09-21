import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoveAssignment } from './application/entity/love-assignment.entity';
import { PpResponseAssignment } from './application/entity/pp-response-assignment.entity';
import { PPResponse } from './application/entity/pp-response.entity';
import { User } from './application/entity/user.entity';
import { Wealth } from './application/entity/wealth.entity';
import { TwitchToken } from './application/entity/twitch-token.entity';
import { TwitchTokenRepository } from './application/repository/twitch-token.repository';
import { TwitchChatService } from './application/service/twitch-chat-service';
import { TwitchAuthService } from './application/service/twitch-auth.service';
import { TwitchChatListener } from './api/twitch-chat.listener';
import { TwitchController } from './api/twitch.controller';
import { ChatCommandRegistry } from './application/registry/chat-command.registry';
import { DiscoveryModule } from '@nestjs/core';
import { TestChatCommandHandler } from './application/chat-command/test.chat-command';

const CHAT_COMMAND_HANDLERS = [TestChatCommandHandler];

@Module({
  imports: [
    DiscoveryModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      TwitchToken,
      LoveAssignment,
      PpResponseAssignment,
      PPResponse,
      User,
      Wealth,
    ]),
  ],
  providers: [
    TwitchTokenRepository,
    {
      provide: TwitchAuthService,
      useFactory: (
        configService: ConfigService,
        tokenRepository: TwitchTokenRepository,
      ) => TwitchAuthService.create(configService, tokenRepository),
      inject: [ConfigService, TwitchTokenRepository],
    },
    {
      provide: TwitchChatService,
      useFactory: (
        configService: ConfigService,
        twitchAuthService: TwitchAuthService,
      ) => TwitchChatService.create(configService, twitchAuthService),
      inject: [ConfigService, TwitchAuthService],
    },
    ChatCommandRegistry,
    TwitchChatListener,
    ...CHAT_COMMAND_HANDLERS,
  ],
  controllers: [TwitchController],
})
export class TwitchModule {}
