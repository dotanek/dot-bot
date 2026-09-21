import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { Wealth } from './wealth.entity';
import { v4 } from 'uuid';

@Entity('user', { schema: TWITCH_SCHEMA })
export class User {
  private constructor(
    id: string,
    name: string,
    externalId: string,
    wealth: Wealth,
  ) {
    this.id = id;
    this.name = name;
    this.externalId = externalId;
    this.wealth = wealth;
  }

  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column()
  externalId: string;

  @OneToOne(() => Wealth, (wealth) => wealth.user, {
    eager: true,
    cascade: true,
  })
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
    const id = v4();

    return new User(id, externalId, username, Wealth.create(id));
  }
}
