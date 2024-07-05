import { Database } from '../../../database/database';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

export class UserRepository {
  private readonly _repository: Repository<User>;

  constructor() {
    this._repository = Database.getInstance().getRepository(User);
  }

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
