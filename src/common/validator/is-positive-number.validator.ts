import { IsNumberValidator } from './is-number.validator';
import { IValidator } from '../interface/validator.interface';

export class IsPositiveNumberValidator
  extends IsNumberValidator
  implements IValidator<string>
{
  check(value: string): boolean {
    return super.check(value) && +value > 0;
  }
}
