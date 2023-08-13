import { IModule } from '../../system-definitions/interface/module.interface';
import { ModuleName } from '../../application/enum/module-name.enum';
import { ISubModule } from '../../system-definitions/interface/sub-module.interface';
import { Config } from '../../config/config';
import { DependencyProvider } from '../../application/provider/dependency.provider';
import { ChatCommandSubModule } from '../command/chat-command-sub.module';
import { ChatSubModule } from '../chat/chat.sub-module';

export class TwitchModule implements IModule {
  readonly name = ModuleName.TWITCH;

  private readonly modules: ISubModule[] = [];

  constructor(config: Config, dependencyProvider: DependencyProvider) {
    const commandModule = new ChatCommandSubModule(config);
    const chatModule = new ChatSubModule(config, commandModule.service);
    this.modules = [commandModule, chatModule];
  }

  async initialize(): Promise<boolean> {
    return (
      await Promise.all(this.modules.map((module) => module.initialize()))
    ).every((initResult) => initResult);
  }
}
