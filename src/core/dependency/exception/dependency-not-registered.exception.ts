import { Exception } from '../../common/base/exception';

export class DependencyNotRegisteredException extends Exception {
  constructor(key: string) {
    super(
      'DependencyNotRegisteredException',
      `dependency '${key}' has not been registered`,
    );
  }
}
