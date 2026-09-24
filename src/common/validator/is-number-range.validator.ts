import { InvalidArgumentException } from '../../twitch/application/exception/invalid-argument.exception';
import { IValidator } from '../interface/validator.interface';
import { IsNumberValidator } from './is-number.validator';

export class IsNumberRangeValidator
  extends IsNumberValidator
  implements IValidator<string>
{
  constructor(
    private readonly _min: number = Number.MIN_SAFE_INTEGER,
    private readonly _max: number = Number.MAX_SAFE_INTEGER,
  ) {
    if (_min && _max && _min > _max) {
      throw new InvalidArgumentException(
        `'min' value cannot be bigger than 'max'`,
      );
    }

    super();
  }

  check(value: string): boolean {
    return (
      super.check(value) &&
      Number(value) >= this._min &&
      Number(value) <= this._max
    );
  }
}
