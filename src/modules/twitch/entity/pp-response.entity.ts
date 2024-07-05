import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { v4 } from 'uuid';

@Entity('pp_response', { schema: TWITCH_SCHEMA })
export class PPResponse {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  content: string;

  @Column()
  verified: boolean;

  static create(content: string, verified = false): PPResponse {
    const ppResponse = new PPResponse();

    ppResponse.id = v4();
    ppResponse.content = content;
    ppResponse.verified = verified;

    return ppResponse;
  }
}
