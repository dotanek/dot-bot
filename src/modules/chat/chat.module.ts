import { IModule } from '../../system-definitions/interface/module.interface';
import { ChatFacade } from './external/chat.facade';
import { Chat } from './core/chat';
import { Config } from '../../config/config';

export class ChatModule implements IModule {
  readonly facade: ChatFacade;
  private readonly chat: Chat;

  private _initialized = false;

  get initialized(): boolean {
    return this._initialized;
  }

  constructor(config: Config) {
    this.chat = Chat.create(config);
    this.facade = new ChatFacade();

    const initInterval = setInterval(() => {
      if (this.chat.initialized) {
        this._initialized = true;
        clearInterval(initInterval)

        console.log(`- ChatModule initialized.`)
      }
    }, 1000)
  }
}
