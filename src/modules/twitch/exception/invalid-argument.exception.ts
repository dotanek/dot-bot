import { Exception } from '../../../core/common/base/exception';

export class InvalidArgumentException extends Exception {
  constructor(reason: string) {
    super('InvalidArgumentException', reason);
  }
}
