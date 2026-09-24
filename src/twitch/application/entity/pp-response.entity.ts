import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { v4 } from 'uuid';

@Entity('pp_response', { schema: TWITCH_SCHEMA })
export class PPResponse {
  private constructor(id: string, content: string, verified: boolean) {
    this.id = id;
    this.content = content;
    this.verified = verified;
  }

  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  content: string;

  @Column()
  verified: boolean;

  static create(content: string, verified = false): PPResponse {
    return new PPResponse(v4(), content, verified);
  }
}
