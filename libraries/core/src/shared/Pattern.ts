import type { ComputedPort, LifecyclePort, StatePort } from "./Ports";
import type { AnyFunction, AnyObject, Reactive } from "./types";

/**
 * The base entity for all elements (core object).
 */
export type Pattern<
	/**
	 * Properties can be stateless or statefull (with wrapped `State` values).
	 */
	Props extends Record<string, Reactive<Value> | Value> = AnyObject,
> = Props;

export type PatternFactory<Input extends AnyObject, Output extends Pattern> = (
	ports: Ports,
) => (input: Input) => Output;

export type Ports = {
	computed: ComputedPort;
	lifecycle: LifecyclePort;
	state: StatePort;
};

type Value = AnyFunction | boolean | number | readonly unknown[] | string;
