import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { DateProvider } from '../../../common/date-provider';
import { PPResponse } from './pp-response.entity';

@Entity('pp_response_assignment', { schema: TWITCH_SCHEMA })
export class PpResponseAssignment {
  private constructor(userId: string, responseId: string, date: Date) {
    this.userId = userId;
    this.responseId = responseId;
    this.date = date;
  }

  @PrimaryColumn('uuid')
  userId: string;

  @Column()
  responseId: string;

  @Column()
  date: Date;

  isExpired(): boolean {
    return this.date.getDate() !== DateProvider.getNow().getDate();
  }

  refresh(response: PPResponse): void {
    this.responseId = response.id;
    this.date = DateProvider.getNow();
  }

  static create(userId: string, responseId: string): PpResponseAssignment {
    return new PpResponseAssignment(userId, responseId, DateProvider.getNow());
  }
}
