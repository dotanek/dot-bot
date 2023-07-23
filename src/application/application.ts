import { IModule } from '../system-definitions/interface/module.interface';
import { ChatModule } from '../modules/chat/chat.module';
import {Config} from "../config/config";

export class Application {
  private readonly modules: IModule[] = [];

  running = true;

  constructor() {
    console.log('Application starting...')

    const config = new Config();

    this.modules = [
      new ChatModule(config),
    ];

    const initInterval = setInterval(() => {
      if (this.modules.every((module) => module.initialized)) {
        clearInterval(initInterval);

        console.log('Application started successfully.')
      }
    }, 1000);
  }

}
