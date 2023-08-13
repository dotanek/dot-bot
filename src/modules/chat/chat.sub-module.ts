import { ChatService } from './core/chat.service';
import { Config } from '../../config/config';
import { ISubModule } from '../../system-definitions/interface/sub-module.interface';
import { ChatCommandService } from '../command/core/chat-command.service';

export class ChatSubModule implements ISubModule {
  readonly service: ChatService;

  constructor(config: Config, chatCommandService: ChatCommandService) {
    this.service = new ChatService(config, chatCommandService);
  }

  initialize(): Promise<boolean> {
    return this.service.initialize();
  }
}
