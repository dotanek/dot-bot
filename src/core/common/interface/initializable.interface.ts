export interface IInitializable {
  initialize(): Promise<boolean>;
}
