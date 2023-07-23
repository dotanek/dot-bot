import {ConfigException} from "./config.exception";
import {ConfigKey} from "../enum/config-key.enum";

export class MissingEvConfigException extends ConfigException {
  constructor(key: ConfigKey) {
    super(`missing environment variable '${key}'`);
  }
}