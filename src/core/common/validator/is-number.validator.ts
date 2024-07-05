import { IValidator } from '../interface/validator.interface';

export class IsNumberValidator implements IValidator<string> {
  check(value: unknown): boolean {
    return !isNaN(Number(value));
  }
}
