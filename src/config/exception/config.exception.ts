import { Exception } from '../../system-definitions/base/exception';

export class ConfigException extends Exception {
  constructor(reason: string) {
    super('ConfigException', `Config: ${reason}`);
  }
}
