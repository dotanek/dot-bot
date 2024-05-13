import { IInitializable } from '../interface/initializable.interface';

export class InterfaceCheckUtil {
  static isInitializable(instance: object): instance is IInitializable {
    return 'initialize' in instance;
  }
}
