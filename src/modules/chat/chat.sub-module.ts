import { ChatService } from './core/chat.service';
import { Config } from '../../config/config';
import { ChatMessageFactory } from './core/factory/chat-message.factory';
import { ISubModule } from '../../system-definitions/interface/sub-module.interface';
import { ChatCommandService } from '../command/core/chat-command.service';

export class ChatSubModule implements ISubModule {
  readonly service: ChatService;

  constructor(config: Config, chatCommandService: ChatCommandService) {
    const chatMessageFactory = new ChatMessageFactory(config);

    this.service = new ChatService(
      config,
      chatCommandService,
      chatMessageFactory,
    );
  }

  initialize(): Promise<boolean> {
    return this.service.initialize();
  }
}
