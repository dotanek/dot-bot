import { UserRepository } from '../repository/user.repository';
import database from '../../../database/database';
import { User } from '../entity/user.entity';

export class UserInitService {
  private userRepository: UserRepository;

  async initializeUser(externalId: string): Promise<User> {
    const user = User.createFor(externalId);

    await this.userRepository.save(user);

    return user;
  }

  async initialize() {
    try {
      this.userRepository = new UserRepository(await database);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}