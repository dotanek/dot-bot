import { Config } from '../../config/config';
import { ChatCommandService } from './core/chat-command.service';
import { ChatCommandFactory } from './core/factory/chatCommandFactory';
import { DependencyProvider } from '../../application/provider/dependency.provider';
import { ISubModule } from '../../system-definitions/interface/sub-module.interface';

export class ChatCommandSubModule implements ISubModule {
  readonly service: ChatCommandService;

  constructor(config: Config) {
    const commandFactory = new ChatCommandFactory();
    this.service = new ChatCommandService(commandFactory);
  }

  async initialize(): Promise<boolean> {
    return true;
  }
}
