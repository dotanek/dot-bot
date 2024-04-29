import { Exception } from '../../common/base/exception';

export class DependencyMethodNotProvidedException extends Exception {
  constructor(dependencyKey: string) {
    super(
      'DependencyMethodNotProvidedException',
      `construction method not provided for '${dependencyKey}'`,
    );
  }
}
