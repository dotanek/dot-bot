import { Repository } from 'typeorm';
import { Database } from '../../../database/database';
import { LoveAssignment } from '../entity/love.entity';

export class LoveAssignmentRepository {
  private readonly _repository: Repository<LoveAssignment>;

  constructor() {
    this._repository = Database.getInstance().getRepository(LoveAssignment);
  }

  findOneBy(lover: string, loved: string): Promise<LoveAssignment | null> {
    return this._repository.findOneBy({ lover, loved });
  }

  async save(assignment: LoveAssignment): Promise<void> {
    await this._repository.save(assignment);
  }
}
