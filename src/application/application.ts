import { IModule } from '../system-definitions/interface/module.interface';
import { ChatModule } from '../modules/chat/chat.module';
import { Config } from '../config/config';
import * as events from 'events';
import { Exception } from '../system-definitions/base/exception';
import { ApplicationInitException } from './exception/application-init.exception';

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
          `${module.name}... [${initResult ? 'success' : 'failure'}]`,
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
    const config = new Config();

    return new Application([ChatModule.create(config)]);
  }
}
