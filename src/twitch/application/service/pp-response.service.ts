import { PPResponse } from '../entity/pp-response.entity';
import { PPResponseRepository } from '../repository/pp-response.repository';
import { PPResponseAssignmentRepository } from '../repository/pp-response-assignment.repository';
import { ResponseNotFoundTwitchException } from '../exception/response-not-found.twitch-exception';
import { RandomProvider } from '../../../common/random-provider';
import { PpResponseAssignment } from '../entity/pp-response-assignment.entity';

export const PP_RESPONSE_SERVICE = 'pp-response-service';

export class PPResponseService {
  constructor(
    private readonly _ppResponseRepository: PPResponseRepository,
    private readonly _ppResponseAssignmentRepository: PPResponseAssignmentRepository,
  ) {}

  async findAssigned(userId: string): Promise<PPResponse | null> {
    const assignment =
      await this._ppResponseAssignmentRepository.findOne(userId);

    if (assignment && !assignment.isExpired()) {
      const response = await this._ppResponseRepository.findOne(
        assignment.responseId,
      );

      if (!response) {
        throw new ResponseNotFoundTwitchException(assignment.responseId);
      }

      return response;
    }

    return null;
  }

  async assignRandom(userId: string): Promise<PPResponse | null> {
    const responses = await this._ppResponseRepository.findVerified();
    const responseCount = responses.length;

    if (responseCount > 0) {
      const rangeBottom = 0;
      const integerTrue = true;

      const response =
        responses[
          RandomProvider.getNumber(rangeBottom, responseCount, integerTrue)
        ];

      await this._ppResponseAssignmentRepository.save(
        PpResponseAssignment.create(userId, response.id),
      );

      return response;
    }

    return null;
  }
}
