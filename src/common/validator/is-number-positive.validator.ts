import { IsNumberValidator } from './is-number.validator';
import { IValidator } from '../interface/validator.interface';

/**
 * Does not include zero
 */
export class IsNumberPositiveValidator
  extends IsNumberValidator
  implements IValidator<string>
{
  check(value: string): boolean {
    return super.check(value) && Number(value) > 0;
  }
}
