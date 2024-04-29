import { ModuleName } from '../../application/enum/module-name.enum';
import {
  ITwitchService,
  TWITCH_SERVICE,
  TwitchService,
} from './services/twitch.service';
import { IModule } from '../../core/common/interface/module.interface';
import { DependencyProvider } from '../../core/dependency/dependency-provider';
import {
  USER_INIT_SERVICE,
  UserInitService,
} from './services/user-init.service';
import { TWITCH_CLIENT } from './const/twitch-client.key';
import { TwitchClientFactory } from './factory/twitch-client.factory';
import { Config } from '../../config/config';
import { COMMAND_PROVIDER, CommandProvider } from './provider/command.provider';

export class TwitchModule implements IModule {
  readonly name = ModuleName.TWITCH;

  private readonly service: ITwitchService;

  constructor() {
    const dependencyProvider = DependencyProvider.getInstance();
    const config = Config.getInstance();

    dependencyProvider.register([
      {
        key: TWITCH_CLIENT,
        factory: () => TwitchClientFactory.get(config),
      },
      {
        key: USER_INIT_SERVICE,
        class: UserInitService,
      },
      {
        key: COMMAND_PROVIDER,
        class: CommandProvider,
      },
      {
        key: TWITCH_SERVICE,
        class: TwitchService,
      },
    ]);

    this.service = dependencyProvider.get(TWITCH_SERVICE);
  }

  async initialize(): Promise<boolean> {
    return this.service.initialize();
  }
}
