import { Config } from '../../config/config';
import { ChatCommandService } from './core/chat-command.service';
import { ChatCommandFactory } from './core/factory/chatCommandFactory';
import { ISubModule } from '../../system-definitions/interface/sub-module.interface';

export class ChatCommandSubModule implements ISubModule {
  readonly service: ChatCommandService;

  constructor() {
    const commandFactory = new ChatCommandFactory();
    this.service = new ChatCommandService(commandFactory);
  }

  async initialize(): Promise<boolean> {
    return true;
  }
}
