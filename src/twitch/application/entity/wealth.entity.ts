import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { User } from './user.entity';
import { InvalidArgumentException } from '../exception/invalid-argument.exception';

const DEFAULT_VALUE = 0;

@Entity('wealth', { schema: TWITCH_SCHEMA })
export class Wealth {
  private constructor(id: string, userId: string, value: number) {
    this.id = id;
    this.userId = userId;
    this.value = value;
  }

  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  value: number;

  @OneToOne(() => User, (user) => user.wealth)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user!: User;

  increase(value: number): void {
    this._validatePositiveValue(value);

    this.value += value;
  }

  decrease(value: number): void {
    this._validatePositiveValue(value);

    this.value -= value;
  }

  set(value: number): void {
    this.value = value;
  }

  private _validatePositiveValue(value: number): void {
    if (value < 0) {
      throw new InvalidArgumentException('value is not a positive number');
    }
  }

  public static create(userId: string): Wealth {
    return new Wealth(v4(), userId, DEFAULT_VALUE);
  }
}
