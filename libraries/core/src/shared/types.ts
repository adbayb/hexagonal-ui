export type AnyFunction = (...arguments_: never[]) => unknown;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AnyObject = Record<string, Reactive<Value> | Value>;
export type Reactive<Input = unknown> = () => Input;

export type Value =
	| AnyFunction
	| boolean
	| null
	| number
	| readonly unknown[]
	| Record<string, unknown>
	| string
	| undefined;
