import { IValidator } from '../interface/validator.interface';

export class IsNumberValidator implements IValidator<string> {
  check(value: string): boolean {
    return !isNaN(+value);
  }
}
