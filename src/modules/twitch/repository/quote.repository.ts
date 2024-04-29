import { Repository } from 'typeorm';
import { Quote } from '../entity/quote.entity';
import { Database } from '../../../database/database';

export class QuoteRepository {
  private readonly repository: Repository<Quote>;

  constructor() {
    this.repository = Database.getInstance().getRepository(Quote);
  }

  count(): Promise<number> {
    return this.repository.count();
  }

  async save(quote: Quote): Promise<void> {
    await this.repository.save(quote);
  }
}
