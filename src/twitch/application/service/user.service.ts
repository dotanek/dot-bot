import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';
import { TwitchApiService } from './twitch-api.service';
import { UserNotFoundTwitchException } from '../exception/user-not-found.twitch-exception';

@Injectable()
export class UserService {
  constructor(
    private readonly _apiService: TwitchApiService,
    private readonly _userRepository: UserRepository,
  ) {}

  async findOrCreate(name: string): Promise<User> {
    const twitchUser = await this._apiService.findUserByName(name);

    if (!twitchUser) {
      throw new UserNotFoundTwitchException(name);
    }

    const twitchName = twitchUser.name;
    const twitchId = twitchUser.id;

    let user = await this._userRepository.findOneByExternalId(twitchId);

    if (!user) {
      user = User.create(twitchId, twitchName);
    } else if (user.name !== twitchUser.name) {
      user.name = twitchName;
    }

    await this._userRepository.save(user);

    return user;
  }
}
