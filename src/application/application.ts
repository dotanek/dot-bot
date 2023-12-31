import { IModule } from '../system-definitions/interface/module.interface';
import { ApplicationInitException } from './exception/application-init.exception';
import { TwitchModule } from '../modules/twitch/twitch.module';

export class Application {
  private constructor(private readonly modules: IModule[]) {}

  async initialize() {
    console.log(`Starting application.`);
    console.log(`Initializing modules...`);

    let someInitialized = false;

    await Promise.all(
      this.modules.map(async (module) => {
        const initResult = await module.initialize();

        console.log(
          `${module.name}... ${' '.repeat(20 - module.name.length)} [${
            initResult ? 'success' : 'failure'
          }]`,
        );

        if (initResult) {
          someInitialized = true;
        }

        return initResult;
      }),
    );

    if (!someInitialized) {
      throw new ApplicationInitException('no modules initialized successfully');
    }

    console.log(`Application started.`);
  }

  static create(): Application {
    return new Application([new TwitchModule()]);
  }
}
