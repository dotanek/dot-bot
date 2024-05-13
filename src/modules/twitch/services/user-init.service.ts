import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';
import { IInitializable } from '../../../core/common/interface/initializable.interface';

export const USER_INIT_SERVICE = 'user-init-service';

export interface IUserInitService {
  initializeUser(externalId: string): Promise<User>;
}

export class UserInitService implements IUserInitService, IInitializable {
  private _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  async initializeUser(externalId: string): Promise<User> {
    const user = User.createFor(externalId);

    await this._userRepository.save(user);

    return user;
  }

  async initialize() {
    try {
      this._userRepository = new UserRepository();
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
