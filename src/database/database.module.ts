import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';

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
          autoLoadEntities: true,
          migrations: [`${__dirname}\\migration\\*.ts`],
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
