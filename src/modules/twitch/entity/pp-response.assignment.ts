import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { DateProvider } from '../../../core/date-provider';

@Entity('pp_response_assignment', { schema: TWITCH_SCHEMA })
export class PpResponseAssignment {
  @PrimaryColumn('uuid')
  userId: string;

  @Column()
  responseId: string;

  @Column()
  date: Date;

  isExpired(): boolean {
    return (
      this.date.getDate() !== DateProvider.getInstance().getNow().getDate()
    );
  }

  static create(userId: string, responseId: string): PpResponseAssignment {
    const entity = new PpResponseAssignment();

    entity.userId = userId;
    entity.responseId = responseId;
    entity.date = DateProvider.getInstance().getNow();

    return entity;
  }
}
