import { InvalidArgumentException } from '../twitch/application/exception/invalid-argument.exception';

export class RandomProvider {
  static getNumber(from = 0, to = 1, integer = false): number {
    if (from > to) {
      throw new InvalidArgumentException(
        `'from' value cannot be bigger than 'to'`,
      );
    }

    const value = from + Math.random() * (to - from);

    return integer ? Math.floor(value) : value;
  }

  static getBoolean(): boolean {
    return Math.random() >= 0.5;
  }
}
