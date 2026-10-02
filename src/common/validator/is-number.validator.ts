import { IValidator } from '../interface/validator.interface';

export class IsNumberValidator implements IValidator<string> {
  check(value: string): boolean {
    const parsed = Number(value);

    return !isNaN(parsed) && parsed <= Number.MAX_SAFE_INTEGER;
  }
}
