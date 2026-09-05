// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...arguments_: any[]) => any;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AnyObject = {};

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
