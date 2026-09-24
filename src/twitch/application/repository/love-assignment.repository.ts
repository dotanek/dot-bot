import { Repository } from 'typeorm';
import { LoveAssignment } from '../entity/love-assignment.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class LoveAssignmentRepository {
  constructor(
    @InjectRepository(LoveAssignment)
    private readonly _repository: Repository<LoveAssignment>,
  ) {}

  findOneBy(lover: string, loved: string): Promise<LoveAssignment | null> {
    return this._repository.findOneBy({ lover, loved });
  }

  async save(assignment: LoveAssignment): Promise<void> {
    await this._repository.save(assignment);
  }
}
