export class DateProvider {
  private static _instance: DateProvider;

  getNow(): Date {
    return new Date();
  }

  static getInstance(): DateProvider {
    return this._instance || (this._instance = new DateProvider());
  }
}
