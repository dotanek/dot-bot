import {
  Dependency,
  IDependencyProvider,
} from './interface/dependency-manager.interface';
import { DependencyDuplicatedException } from './exception/dependency-duplicated.exception';
import { DependencyNotRegisteredException } from './exception/dependency-not-registered.exception';
import { DependencyMethodNotProvidedException } from './exception/dependency-method-not-provided.exception';
import { isInitializable } from '../common/interface/initializable.interface';

export class DependencyProvider implements IDependencyProvider {
  private static _instance: DependencyProvider;

  private readonly _dependencies: Record<string, object> = {};

  get<T extends object>(key: string): T {
    if (!this._dependencies[key]) {
      throw new DependencyNotRegisteredException(key);
    }

    return this._dependencies[key] as T;
  }

  register(dependencies: Dependency[]): void {
    for (const dependency of dependencies) {
      if (this._dependencies[dependency.key]) {
        throw new DependencyDuplicatedException();
      }

      if (dependency.class) {
        this._dependencies[dependency.key] = new dependency.class();
        continue;
      }

      if (dependency.factory) {
        this._dependencies[dependency.key] = dependency.factory();
        continue;
      }

      throw new DependencyMethodNotProvidedException(dependency.key);
    }
  }

  async initialize(): Promise<boolean> {
    const results = [];

    for (const instance of Object.values(this._dependencies)) {
      if (isInitializable(instance)) {
        results.push(await instance.initialize());
      }
    }

    return results.every((result) => result);
  }

  static getInstance(): DependencyProvider {
    return this._instance || (this._instance = new DependencyProvider());
  }
}
