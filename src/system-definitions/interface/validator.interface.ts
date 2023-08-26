export interface IValidator<T> {
  check(value: T): boolean;
}