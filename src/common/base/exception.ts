import { IException } from '../interface/exception.interface';

export abstract class Exception extends Error implements IException {
  constructor(
    readonly name: string,
    readonly message: string,
  ) {
    super(message);
  }
}
