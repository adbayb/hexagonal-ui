// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...arguments_: any[]) => any;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AnyObject = {};

export type Reactive<Value = unknown> = () => Value;
