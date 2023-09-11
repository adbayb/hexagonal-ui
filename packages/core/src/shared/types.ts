export type State<Value = unknown> = () => Value;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

// eslint-disable-next-line @typescript-eslint/ban-types
export type AnyObject = {};
