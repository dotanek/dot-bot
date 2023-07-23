import { IException } from '../interface/exception.interface';

export abstract class Exception implements IException {
  constructor(
    readonly name: string,
    readonly message: string,
  ) {}
}
