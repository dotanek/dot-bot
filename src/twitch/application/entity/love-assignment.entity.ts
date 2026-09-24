import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TWITCH_SCHEMA } from './schema/twitch.schema';
import { v4 } from 'uuid';

import { DateProvider } from '../../../common/date-provider';
import { RandomProvider } from '../../../common/random-provider';

@Entity({ name: 'love_assignment', schema: TWITCH_SCHEMA })
export class LoveAssignment {
  constructor(
    id: string,
    lover: string,
    loved: string,
    value: number,
    date: Date,
  ) {
    this.id = id;
    this.lover = lover;
    this.loved = loved;
    this.value = value;
    this.date = date;
  }

  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  lover: string;

  @Column()
  loved: string;

  @Column()
  value: number;

  @Column()
  date: Date;

  isExpired(): boolean {
    return this.date.getDate() !== DateProvider.getNow().getDate();
  }

  refresh(): void {
    this.date = DateProvider.getNow();
    this.value = getLoveValue();
  }

  static create(lover: string, loved: string): LoveAssignment {
    return new LoveAssignment(
      v4(),
      lover,
      loved,
      getLoveValue(),
      DateProvider.getNow(),
    );
  }
}

function getLoveValue(): number {
  const rangeBottom = 50;
  const rangeTop = 100;
  const integerTrue = true;

  const value = Number(
    RandomProvider.getNumber(rangeBottom, rangeTop, integerTrue),
  );

  if (value === 50) {
    return -999;
  }

  return value;
}
