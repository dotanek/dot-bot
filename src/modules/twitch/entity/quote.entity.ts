import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { v4 as uuid } from 'uuid';
import { DateProvider } from '../../../core/date-provider';

@Entity('quote', { schema: TWITCH_SCHEMA })
export class Quote {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  number: number;

  @Column()
  content: string;

  @Column()
  date: Date;

  static create(number: number, content: string): Quote {
    const quote = new Quote();

    quote.id = uuid();
    quote.number = number;
    quote.content = content;
    quote.date = DateProvider.getInstance().getNow();

    return quote;
  }
}
