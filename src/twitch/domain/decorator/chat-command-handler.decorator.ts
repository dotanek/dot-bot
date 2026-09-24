import { DiscoveryService } from '@nestjs/core';

export interface ChatCommandOptions {
  name: string;
  aliases?: string[];
  description?: string;
}

export const ChatCommandHandler =
  DiscoveryService.createDecorator<ChatCommandOptions>();
