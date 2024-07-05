import { Exception } from '../../core/common/base/exception';

export class DependencyProvisionException extends Exception {
  constructor(dependency: string) {
    super(
      'DependencyProvisionException',
      `unresolved dependency '${dependency}'`,
    );
  }
}
