import 'reflect-metadata';

export function Inject(token: string) {
  return function (target: object, propertyKey: string) {
    Reflect.defineMetadata('balls', { propertyKey, token }, target);
  };
}
