/**
 * The base entity for all elements (core object)
 */
export type View<
	Tag extends "a" | "button",
	Attributes extends Record<
		string | "children",
		boolean | number | string | ((...arg: unknown[]) => unknown)
	>,
> = {
	tag: Tag;
	attributes: Attributes;
};
