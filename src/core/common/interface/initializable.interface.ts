export interface IInitializable {
  initialize(): Promise<boolean>;
}

export function isInitializable(instance: object): instance is IInitializable {
  return 'initialize' in instance;
}
