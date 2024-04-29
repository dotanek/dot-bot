import {Exception} from "../../core/base/exception";

export class DependencyProvisionException extends Exception {
  constructor(dependency: string) {
    super('DependencyProvisionException', `unresolved dependency '${dependency}'`);
  }
}