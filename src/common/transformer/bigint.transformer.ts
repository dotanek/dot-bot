import { ValueTransformer } from 'typeorm';

export class BigIntTransformer implements ValueTransformer {
  to(value: number): string {
    return value.toString();
  }
  from(value: string): number {
    return Number(value);
  }

  static create(): BigIntTransformer {
    return new BigIntTransformer();
  }
}
