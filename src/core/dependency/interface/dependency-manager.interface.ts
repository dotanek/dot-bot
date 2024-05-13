export class Dependency<Class extends object = object> {
  key: string;
  class?: { new (): Class };
  factory?: () => Class;
}

export interface IDependencyProvider {
  get(key: string): object;
  register(dependencies: Dependency[]): void;
  initialize(): Promise<boolean>;
}
