import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.getOrThrow('DATABASE__HOST'),
          port: configService.getOrThrow('DATABASE__PORT'),
          username: configService.getOrThrow('DATABASE__USER'),
          password: configService.getOrThrow('DATABASE__PASSWORD'),
          database: configService.getOrThrow('DATABASE__NAME'),
          ssl: configService.getOrThrow<boolean>('DATABASE__SSL') && {
            ca: readFileSync(
              join(process.cwd(), 'cert/aws-global-bundle.pem'),
            ).toString(),
            rejectUnauthorized: true,
          },
          autoLoadEntities: true,
          migrations: [`${__dirname}\\migration\\*{.ts,.js}`],
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: false,
          migrationsRun: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
