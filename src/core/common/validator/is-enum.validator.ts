import { IValidator } from '../interface/validator.interface';

export class IsEnumValidator implements IValidator<string> {
  constructor(private readonly enumerate: object) {}

  check(value: string): boolean {
    return Object.values(this.enumerate).includes(value);
  }
}
