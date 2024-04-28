import { Database } from '../../../database/database';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

export class UserRepository {
  private readonly repository: Repository<User>;

  constructor(database: Database) {
    this.repository = database.getRepository(User);
  }

  findOneByExternalId(externalId: string): Promise<User | null> {
    return this.repository.findOneBy({ externalId });
  }

  async save(user: User): Promise<void> {
    await this.repository.save(user);
  }
}
