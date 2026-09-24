import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import {
  ChatCommandHandler,
  ChatCommandOptions,
} from '../../domain/decorator/chat-command-handler.decorator';
import { ChatCommandHandlerBase } from '../../domain/base/chat-command';
import { TwitchException } from '../exception/twitch.exception';

interface ChatCommandEntry {
  handler: ChatCommandHandlerBase;
  metadata: ChatCommandOptions;
}

@Injectable()
export class ChatCommandRegistry implements OnModuleInit {
  private readonly _entryMap = new Map<string, ChatCommandEntry>();

  constructor(private readonly _discoveryService: DiscoveryService) {}

  get(key: string): ChatCommandEntry | null {
    return this._entryMap.get(key) ?? null;
  }

  onModuleInit() {
    const commandHandlerProviders = this._discoveryService.getProviders({
      metadataKey: ChatCommandHandler.KEY,
    });

    for (const provider of commandHandlerProviders) {
      const instance: unknown = provider.instance;
      const meta: ChatCommandOptions | undefined =
        this._discoveryService.getMetadataByDecorator(
          ChatCommandHandler,
          provider,
        );

      if (!meta) {
        throw new Error(`${provider.name} is missing ChatCommand metadata`);
      }

      if (!this._implementsInterface(provider.instance)) {
        throw new Error(`${provider.name} does not implement IChatCommand`);
      }

      const entry = {
        handler: instance as ChatCommandHandlerBase,
        metadata: meta,
      };

      for (const key of [meta.name, ...(meta.aliases ?? [])]) {
        if (this._entryMap.has(key)) {
          throw new TwitchException(
            `duplicate key '${key}' in command registry (names and aliases)`,
          );
        }

        this._entryMap.set(key, entry);
      }
    }
  }

  private _implementsInterface(
    instance: unknown,
  ): instance is ChatCommandHandlerBase {
    if (typeof (instance as ChatCommandHandlerBase).executeLegacy !== 'function') {
      return false;
    }

    return true;
  }
}
