export interface IChattable {
  readonly chatMessage: string;
}

export function isChattable(instance: object): instance is IChattable {
  return 'chatMessage' in instance;
}
