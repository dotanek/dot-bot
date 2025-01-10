import { PPResponse } from '../entity/pp-response.entity';
import { PPResponseRepository } from '../repository/pp-response.repository';
import { PPResponseAssignmentRepository } from '../repository/pp-response-assignment.repository';
import { ResponseNotFoundTwitchException } from '../exception/response-not-found.twitch-exception';
import { RandomGenerator } from '../../../core/random-generator';
import { PpResponseAssignment } from '../entity/pp-response.assignment';

export const PP_RESPONSE_SERVICE = 'pp-response-service';

export class PPResponseService {
  private readonly _ppResponseRepository: PPResponseRepository;
  private readonly _ppResponseAssignmentRepository: PPResponseAssignmentRepository;

  constructor() {
    this._ppResponseRepository = new PPResponseRepository();
    this._ppResponseAssignmentRepository = new PPResponseAssignmentRepository();
  }

  async findAssigned(userId: string): Promise<PPResponse | null> {
    const existingAssignment =
      await this._ppResponseAssignmentRepository.findOne(userId);

    if (existingAssignment && !existingAssignment.isExpired()) {
      const response = this._ppResponseRepository.findOne(
        existingAssignment.responseId,
      );

      if (!response) {
        throw new ResponseNotFoundTwitchException(
          existingAssignment.responseId,
        );
      }

      return response;
    }

    return null;
  }

  async findRandomVerified(): Promise<PPResponse | null> {
    const responses = await this._ppResponseRepository.findVerified();
    const count = responses.length;

    return count > 0
      ? responses[RandomGenerator.getInstance().getNumberV2(0, count, true)]
      : null;
  }

  async assign(userId: string, responseId: string): Promise<void> {
    await this._ppResponseAssignmentRepository.save(
      PpResponseAssignment.create(userId, responseId),
    );
  }
}
