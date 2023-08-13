import { ModuleName } from '../enum/module-name.enum';
import { DependencyProvisionException } from '../exception/dependency-provision.exception';

export class DependencyProvider {
  private readonly facades: Record<ModuleName, unknown> = {
    TwitchModule: null,
  };

  injectFacade(module: ModuleName, facade: unknown): void {
    this.facades[module] = facade;
  }

  getFacadeFor<T>(module: ModuleName): T {
    if (this.facades[module] === null) {
      throw new DependencyProvisionException(module);
    }

    return this.facades[module] as T;
  }
}
