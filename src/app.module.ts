import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TwitchModule } from './twitch/twitch.module';
import { globalSchema } from './config/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: globalSchema,
      envFilePath: '.env',
    }),
    DatabaseModule,
    TwitchModule,
  ],
})
export class AppModule {}
