import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { Wealth } from './wealth.entity';
import { v4 } from 'uuid';

@Entity('user', { schema: TWITCH_SCHEMA })
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column()
  externalId: string;

  @OneToOne(() => Wealth, (wealth) => wealth.user, { eager: true, cascade: true })
  wealth: Wealth;

  getWealth(): number {
    return this.wealth.value;
  }

  increaseWealth(value: number): void {
    this.wealth.increase(value);
  }

  decreaseWealth(value: number): void {
    this.wealth.decrease(value);
  }

  setWealth(value: number): void {
    this.wealth.set(value);
  }

  static createFor(externalId: string, username: string): User {
    const user = new User();

    user.id = v4();
    user.externalId = externalId;
    user.wealth = Wealth.create(user.id);
    user.name = username;

    return user;
  }
}
