import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { AccessToken } from '@twurple/auth';

@Entity('tokens', { schema: TWITCH_SCHEMA })
export class TwitchToken {
  private constructor(
    id: string,
    access: string,
    refresh: string,
    updatedAt: Date,
  ) {
    this.id = id;
    this.access = access;
    this.refresh = refresh;
    this.updatedAt = updatedAt;
  }

  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  access: string;

  @Column()
  refresh: string;

  @Column()
  updatedAt: Date;

  update(
    accessToken: string,
    refreshToken: string,
    obtainmentDate: Date,
  ): void {
    this.access = accessToken;
    this.refresh = refreshToken;
    this.updatedAt = obtainmentDate;
  }

  toTwurpleToken(): AccessToken {
    return {
      accessToken: this.access,
      refreshToken: this.refresh,
      expiresIn: 10000, // TODO REMOVE
      obtainmentTimestamp: this.updatedAt.getTime(), // TODO divide 1000?
      scope: ['chat:read', 'chat:edit'],
    };
  }

  static create(
    accessToken: string,
    refreshToken: string,
    obtainmentDate: Date,
  ) {
    return new TwitchToken(v4(), accessToken, refreshToken, obtainmentDate);
  }
}
