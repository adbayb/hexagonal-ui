/**
 * The base entity for all elements (core object)
 */
export class View<Attributes extends AttributesConstraint> {
	private readonly tag: Tag;
	private readonly attributes: Attributes;

	public constructor(tag: Tag, attributes: Attributes) {
		this.tag = tag;
		this.attributes = attributes;
	}

	public getTag() {
		return this.tag;
	}

	// @todo: AttributeSet ValueObject? (https://developer.android.com/reference/android/util/AttributeSet)
	public getAttribute(key: keyof Attributes) {
		return this.attributes[key];
	}

	public getAttributes() {
		return this.attributes;
	}

	public setAttribute(
		key: keyof Attributes,
		value: Attributes[keyof Attributes],
	) {
		this.attributes[key] = value;
	}

	public removeAttribute(key: keyof Attributes) {
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete this.attributes[key];
	}

	public setChildren<Children extends Attributes["children"]>(
		children: Children,
	) {
		if (!Object.hasOwnProperty.call(this.attributes, "children")) return;

		// @ts-expect-error to fix
		this.attributes.children = children;
	}

	public getChildren<Children extends Attributes["children"]>() {
		return this.attributes.children as Children;
	}
}

type Tag = "a" | "button";

type AttributesConstraint = Record<
	string | "children",
	boolean | number | string | ((...arg: unknown[]) => unknown)
>;
