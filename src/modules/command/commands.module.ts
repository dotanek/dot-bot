import { IModule } from '../../system-definitions/interface/module.interface';
import { ModuleName } from '../../application/enum/module-name.enum';
import { CommandsFacade } from './external/commands.facade';
import { Config } from '../../config/config';
import { CommandsService } from './core/commands.service';
import { CommandFactory } from './core/factory/command.factory';
import { DependencyProvider } from '../../application/provider/dependency.provider';

export class CommandsModule implements IModule {
  readonly name = ModuleName.COMMANDS;

  private readonly service: CommandsService;

  constructor(config: Config, dependencyProvider: DependencyProvider) {
    const commandFactory = new CommandFactory();
    this.service = new CommandsService(commandFactory);

    const facade = new CommandsFacade(this.service);

    dependencyProvider.injectFacade(this.name, facade);
  }

  async initialize(): Promise<boolean> {
    return true;
  }
}
