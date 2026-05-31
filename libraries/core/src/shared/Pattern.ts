import type { FrameworkPort } from "./Port";
import type { AnyObject, Reactive, Value } from "./types";

export type Pattern<
	/**
	 * Properties can be stateless or statefull (with wrapped `State` values).
	 */
	Props extends Record<string, Reactive<Value> | Value> = AnyObject,
> = Props;

export type PatternFactory<Input extends AnyObject, Output extends Pattern> = (
	frameworkAdapter: FrameworkPort,
) => (input: Input) => Output;
