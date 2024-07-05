export class RandomGenerator {
  private static _instance: RandomGenerator;
  private readonly _seed = Date.now();

  getNumber(): number {
    return Math.random() * 2 - 1;
  }

  static getInstance(): RandomGenerator {
    return this._instance || (this._instance = new RandomGenerator());
  }
}
