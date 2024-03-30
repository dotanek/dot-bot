import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { User } from './user.entity';

const DEFAULT_VALUE = 0;

@Entity('wealth', { schema: TWITCH_SCHEMA })
export class Wealth {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  userId: string;

  @Column()
  value: number;

  @OneToOne(() => User, (user) => user.wealth)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: User;
  public static create(userId: string): Wealth {
    const wealth = new Wealth();

    wealth.id = v4();
    wealth.userId = userId;
    wealth.value = DEFAULT_VALUE;

    return wealth;
  }
}
