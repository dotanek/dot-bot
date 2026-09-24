import { Repository } from 'typeorm';
import { PPResponse } from '../entity/pp-response.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class PPResponseRepository {
  constructor(
    @InjectRepository(PPResponse)
    private readonly _repository: Repository<PPResponse>,
  ) {}

  findVerified(): Promise<PPResponse[]> {
    return this._repository.findBy({ verified: true });
  }

  findOne(id: string): Promise<PPResponse | null> {
    return this._repository.findOneBy({ id });
  }

  async save(ppResponse: PPResponse): Promise<void> {
    await this._repository.save(ppResponse);
  }
}
