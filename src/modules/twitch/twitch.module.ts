import { ModuleName } from '../../application/enum/module-name.enum';
import {
  ITwitchService,
  TWITCH_SERVICE,
  TwitchService,
} from './services/twitch.service';
import { IModule } from '../../core/common/interface/module.interface';
import { DependencyProvider } from '../../core/dependency/dependency-provider';
import { USER_SERVICE, UserService } from './services/user.service';
import { TWITCH_CLIENT } from './const/twitch-client.key';
import { TwitchClientFactory } from './factory/twitch-client.factory';
import { Config } from '../../config/config';
import { COMMAND_PROVIDER, CommandProvider } from './provider/command.provider';
import {
  PP_RESPONSE_SERVICE,
  PPResponseService,
} from './services/pp-response.service';

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
        key: USER_SERVICE,
        class: UserService,
      },
      {
        key: PP_RESPONSE_SERVICE,
        class: PPResponseService,
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
}
