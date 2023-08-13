import { ModuleName } from '../../application/enum/module-name.enum';

export interface IModule {
  readonly name: ModuleName;

  initialize(): Promise<boolean>;
}
