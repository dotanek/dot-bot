import { Exception } from '../../../common/base/exception';

export class InvalidArgumentException extends Exception {
  constructor(reason: string) {
    super('InvalidArgumentException', reason);
  }
}
