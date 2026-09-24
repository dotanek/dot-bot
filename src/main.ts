import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    await app.listen(process.env.PORT ?? 3000);
  } catch (exception: unknown) {
    Logger.error(exception);
  }
}

void bootstrap();
