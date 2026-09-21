import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { PpResponseAssignment } from '../entity/pp-response-assignment.entity';

export class PPResponseAssignmentRepository {
  constructor(
    @InjectRepository(PpResponseAssignment)
    private readonly _repository: Repository<PpResponseAssignment>,
  ) {}

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
