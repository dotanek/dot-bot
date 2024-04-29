import { Exception } from '../../common/base/exception';

export class DependencyDuplicatedException extends Exception {
  constructor() {
    super(
      'DependencyDuplicatedException',
      'dependency key cannot be registered more than once',
    );
  }
}
