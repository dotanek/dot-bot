import { Repository } from 'typeorm';
import { TwitchToken } from '../entity/twitch-token.entity';

import { InjectRepository } from '@nestjs/typeorm';

export class TwitchTokenRepository {
  constructor(
    @InjectRepository(TwitchToken)
    private readonly _repository: Repository<TwitchToken>,
  ) {}

  async findOne(): Promise<TwitchToken | null> {
    return (await this._repository.find())[0] ?? null;
  }

  async save(entity: TwitchToken): Promise<void> {
    await this._repository.save(entity);
  }
}
