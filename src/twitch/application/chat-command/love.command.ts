import {
  ChatCommand,
  ChatCommandHandlerBase,
} from '../../domain/base/chat-command';
import { ChatCommandHandler } from '../../domain/decorator/chat-command-handler.decorator';
import { LoveAssignment } from '../entity/love-assignment.entity';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';
import { LoveAssignmentRepository } from '../repository/love-assignment.repository';
import { TwitchChatService } from '../service/twitch-chat-service';

@ChatCommandHandler({ name: 'love' })
export class LoveCommand extends ChatCommandHandlerBase {
  protected _commandTree = {
    handler: (command: ChatCommand) => this._handle(command),
  };

  constructor(
    chatService: TwitchChatService,
    private readonly _assignmentRepository: LoveAssignmentRepository,
  ) {
    super(chatService);
  }

  private async _handle(command: ChatCommand): Promise<void> {
    const userName = command.userName.toLowerCase();
    const targetName = command.getArgument(0)?.replace('@', '').toLowerCase();

    if (!targetName) {
      throw new InvalidCommandArgumentException('love', 'target');
    }

    if (targetName === userName) {
      await this._send(
        command.channelName,
        'Are you trying to love yourself you lil freak?',
      );

      return;
    }

    let assignment = await this._assignmentRepository.findOneBy(
      userName,
      targetName,
    );

    if (!assignment) {
      assignment = LoveAssignment.create(userName, targetName);
    } else if (assignment.isExpired()) {
      assignment.refresh();
    }

    await this._assignmentRepository.save(assignment);

    await this._chatService.sendMessage(
      command.channelName,
      `@${command.userName}, there is ${assignment.value}% love dotane1Heart between you and ${targetName}!`,
    );
  }
}
