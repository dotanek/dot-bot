import { Exception } from '../../core/common/base/exception';

export class ConfigException extends Exception {
  constructor(reason: string) {
    super('ConfigException', `Config: ${reason}`);
  }
}
