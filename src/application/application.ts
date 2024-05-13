import { TwitchModule } from '../modules/twitch/twitch.module';
import { IModule } from '../core/common/interface/module.interface';
import { Database } from '../database/database';
import { DependencyProvider } from '../core/dependency/dependency-provider';

export class Application {
  private constructor(private readonly modules: IModule[]) {}

  async initialize() {
    console.log('Starting application.');

    process.stdout.write('Initializing database...\t');
    await Database.getInstance().initialize();
    process.stdout.write('[success]\n');

    process.stdout.write('Initializing dependencies...\t');
    await DependencyProvider.getInstance().initialize();
    process.stdout.write('[success]\n');

    console.log('Application started.');
  }

  static create(): Application {
    return new Application([new TwitchModule()]);
  }
}
