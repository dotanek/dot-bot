import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly _repository: Repository<User>,
  ) {}

  findOneByExternalId(externalId: string): Promise<User | null> {
    return this._repository.findOneBy({ externalId });
  }

  findOneByName(name: string): Promise<User | null> {
    return this._repository.findOneBy({ name });
  }

  async save(user: User): Promise<void> {
    await this._repository.save(user);
  }
}
