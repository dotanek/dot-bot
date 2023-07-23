import { IModule } from '../../system-definitions/interface/module.interface';
import { ChatFacade } from './external/chat.facade';
import { Chat } from './core/chat';
import { Config } from '../../config/config';
import {ModuleName} from "../../application/enum/module-name.enum";

export class ChatModule implements IModule {
  readonly name = ModuleName.CHAT;
  constructor(
    readonly facade: ChatFacade,
    private readonly chat: Chat,
  ) {}

  initialize(): Promise<boolean> {
    return this.chat.initialize();
  }

  static create(config: Config): ChatModule {
    const chat = Chat.create(config);
    const facade = new ChatFacade();

    return new ChatModule(facade, chat);
  }
}
