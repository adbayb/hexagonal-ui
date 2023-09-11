import type { AnyFunction, AnyObject, State } from "./types";

/**
 * The base entity for all elements (core object)
 */
export type View<
	Role extends "button" | "link",
	/**
	 * Properties can be stateless or statefull (with wrapped `State` values)
	 */
	Props extends Record<string, State<Value> | Value> = AnyObject,
> = Props & {
	role: Role;
};

type Value = AnyFunction | boolean | number | string;
