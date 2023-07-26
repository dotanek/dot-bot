import { IModule } from '../../system-definitions/interface/module.interface';
import { ChatFacade } from './external/chat.facade';
import { ChatService } from './core/chat.service';
import { Config } from '../../config/config';
import { ModuleName } from '../../application/enum/module-name.enum';
import { DependencyProvider } from '../../application/provider/dependency.provider';
import { config } from 'dotenv';

export class ChatModule implements IModule {
  readonly name = ModuleName.CHAT;

  private readonly service: ChatService;
  readonly facade: ChatFacade;

  constructor(config: Config, dependencyProvider: DependencyProvider) {
    this.service = new ChatService(config, dependencyProvider);
    this.facade = new ChatFacade(this.service);

    dependencyProvider.injectFacade(this.name, this.facade);
  }

  initialize(): Promise<boolean> {
    return this.service.initialize();
  }
}
