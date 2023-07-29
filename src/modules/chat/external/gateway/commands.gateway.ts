import { DependencyProvider } from '../../../../application/provider/dependency.provider';
import {
  CommandsFacade,
  ICommandsFacade,
} from '../../../command/external/commands.facade';
import { ModuleName } from '../../../../application/enum/module-name.enum';
import { ChatMessageDto } from '../../../command/external/dto/chat-message.dto';

export class CommandsGateway implements ICommandsFacade {
  private facade: CommandsFacade | null = null;

  constructor(private readonly dependencyProvider: DependencyProvider) {}

  runCommandFor(message: ChatMessageDto): string {
    return this.getFacade().runCommandFor(message);
  }

  private getFacade(): CommandsFacade {
    if (this.facade === null) {
      this.inject();
    }

    return this.facade!;
  }

  private inject(): void {
    this.facade = this.dependencyProvider.getFacadeFor(ModuleName.COMMANDS);
  }
}
