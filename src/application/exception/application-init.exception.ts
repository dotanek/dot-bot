import { Exception } from '../../core/common/base/exception';

export class ApplicationInitException extends Exception {
  constructor(reason: string) {
    super('ApplicationInitException', reason);
  }
}
