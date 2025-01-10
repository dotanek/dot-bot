export class RandomGenerator {
  private static _instance: RandomGenerator;

  getNumber(): number {
    return Math.random() * 2 - 1;
  }

  getNumberV2(from = 0, to = 1, integer = false): number {
    const value = from + Math.random() * (to - from);

    return integer ? Math.floor(value) : value;
  }

  static getInstance(): RandomGenerator {
    return this._instance || (this._instance = new RandomGenerator());
  }
}
