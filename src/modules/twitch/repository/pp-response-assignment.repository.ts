import { Repository } from 'typeorm';
import { Database } from '../../../database/database';
import { PpResponseAssignmentEntity } from '../entity/pp-response-assignment.entity';

export class PPResponseAssignmentRepository {
  private readonly _repository: Repository<PpResponseAssignmentEntity>;

  constructor() {
    this._repository =
      Database.getInstance().getRepository(PpResponseAssignmentEntity);
  }

  find(): Promise<PpResponseAssignmentEntity[]> {
    return this._repository.find();
  }

  findOne(userId: string): Promise<PpResponseAssignmentEntity | null> {
    return this._repository.findOneBy({ userId });
  }

  async save(assignment: PpResponseAssignmentEntity): Promise<void> {
    await this._repository.save(assignment);
  }

  async delete(assignments: PpResponseAssignmentEntity[]): Promise<void> {
    await this._repository.remove(assignments);
  }
}
