/**
 * The base entity for all elements (core object)
 */
export type View<
	Role extends "a" | "button",
	Props extends Record<string, PropertyValue>, // Stateless property
	State extends Record<string, () => PropertyValue> = AnyObject, // Statefull property
> =
	// Stateless properties are namespaced with `props` key to ease their spreading consumer side,
	// while stateful properties are inlined to ease their granular access (states are more likely to be used atomically)
	State & {
		props: Props & {
			role: Role;
		};
	};

type PropertyValue = AnyFunction | boolean | number | string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

type AnyObject = Record<string, never>;
