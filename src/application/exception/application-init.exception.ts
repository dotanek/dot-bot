import {Exception} from "../../system-definitions/base/exception";

export class ApplicationInitException extends Exception {
  constructor(reason: string) {
    super('ApplicationInitException', reason);
  }
}