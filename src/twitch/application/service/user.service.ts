import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

  async findByName(name: string): Promise<User | null> {
    return this._userRepository.findOneByName(name);
  }

  async findOrCreate(externalId: string, name: string): Promise<User> {
    let user = await this._userRepository.findOneByExternalId(externalId);

    // Create or refresh user name if they changed it
    // TODO use api to look up id & names from twitch and keep only id
    if (!user) {
      user = User.create(externalId, name);
    } else if (user.name !== name) {
      user.name = name;
    }

    await this._userRepository.save(user);

    return user;
  }
}
