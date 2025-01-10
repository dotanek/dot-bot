import { Repository } from 'typeorm';
import { Database } from '../../../database/database';
import { PpResponseAssignment } from '../entity/pp-response.assignment';

export class PPResponseAssignmentRepository {
  private readonly _repository: Repository<PpResponseAssignment>;

  constructor() {
    this._repository =
      Database.getInstance().getRepository(PpResponseAssignment);
  }

  find(): Promise<PpResponseAssignment[]> {
    return this._repository.find();
  }

  findOne(userId: string): Promise<PpResponseAssignment | null> {
    return this._repository.findOneBy({ userId });
  }

  async save(assignment: PpResponseAssignment): Promise<void> {
    await this._repository.save(assignment);
  }

  async delete(assignments: PpResponseAssignment[]): Promise<void> {
    await this._repository.remove(assignments);
  }
}
