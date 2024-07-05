export class RandomGenerator {
  private static _instance: RandomGenerator;

  getNumber(): number {
    return Math.random() * 2 - 1;
  }

  static getInstance(): RandomGenerator {
    return this._instance || (this._instance = new RandomGenerator());
  }
}
