import { IModule } from '../../system-definitions/interface/module.interface';
import { ModuleName } from '../../application/enum/module-name.enum';
import { TwitchService } from './services/twitch.service';

export class TwitchModule implements IModule {
  readonly name = ModuleName.TWITCH;

  private readonly service: TwitchService;

  constructor() {
    this.service = new TwitchService();
  }

  async initialize(): Promise<boolean> {
    return this.service.initialize();
  }
}
