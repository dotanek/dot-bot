import { ChatService } from '../core/chat.service';

export class ChatFacade {
  constructor(private readonly service: ChatService) {}
}
