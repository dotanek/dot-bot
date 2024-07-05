import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';

export const USER_SERVICE = 'user-service';

export interface IUserService {
  findOrCreate(externalId: string, name: string): Promise<User>;
  findByName(name: string): Promise<User | null>;
}

export class UserService implements IUserService {
  private readonly _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  async findByName(name: string): Promise<User | null> {
    return this._userRepository.findOneByName(name);
  }

  async findOrCreate(externalId: string, name: string): Promise<User> {
    let user = await this._userRepository.findOneByExternalId(externalId);

    if (user === null) {
      user = User.createFor(externalId, name);
      await this._userRepository.save(user);
    }

    return user;
  }
}
