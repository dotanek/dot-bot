import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TWITCH_SCHEMA } from './schema/twitch.schema';

@Entity('pp_response_assignment', { schema: TWITCH_SCHEMA })
export class PpResponseAssignmentEntity {
  @PrimaryColumn('uuid')
  userId: string;

  @Column()
  responseId: string;

  @Column()
  date: Date;

  isExpired(): boolean {
    return this.date.getDate() !== new Date().getDate();
  }

  static create(
    userId: string,
    responseId: string,
  ): PpResponseAssignmentEntity {
    const entity = new PpResponseAssignmentEntity();

    entity.userId = userId;
    entity.responseId = responseId;
    entity.date = new Date();

    return entity;
  }
}
