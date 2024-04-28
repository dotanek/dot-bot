import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { Wealth } from './wealth.entity';
import { v4 } from 'uuid';

@Entity('user', { schema: TWITCH_SCHEMA })
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  externalId: string;

  @OneToOne(() => Wealth, (wealth) => wealth.user, { eager: true, cascade: true })
  wealth: Wealth;

  static createFor(externalId: string): User {
    const user = new User();

    user.id = v4();
    user.externalId = externalId;
    user.wealth = Wealth.create(user.id);

    return user;
  }
}
