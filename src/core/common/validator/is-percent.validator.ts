import { IValidator } from '../interface/validator.interface';
import { IsNumberValidator } from './is-number.validator';

export class IsPercentValidator extends IsNumberValidator implements IValidator<string> {
  check(value: string): boolean {
    return super.check(value) && (+value >= 0 && +value <= 100);
  }
}
