/**
 * The base entity for all elements (core object)
 */
export type View<
	Tag extends "a" | "button",
	Attributes extends Record<
		string | "children",
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		boolean | number | string | ((...args: any[]) => any)
	>,
> = Attributes & {
	tag: Tag;
};
