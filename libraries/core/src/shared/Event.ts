export type Event = Pick<
	globalThis.Event,
	| "bubbles"
	| "cancelable"
	| "currentTarget"
	| "defaultPrevented"
	| "eventPhase"
	| "isTrusted"
	| "preventDefault"
	| "stopPropagation"
	| "target"
	| "timeStamp"
	| "type"
>;

/**
 * Narrowed event for text inputs. Useful when reading field values in custom adapters. Pattern
 * handlers intentionally keep the broader `Event` type so attribute objects spread directly onto
 * framework inputs.
 */
export type InputEvent = Omit<Event, "target"> & {
	target: null | { value: string };
};

/**
 * Reads the text value of an input event target without throwing on unexpected shapes (e.g.
 * `target` is `null` in tests).
 *
 * @example
 * 	```ts
 * 	const value = readInputValue(event);
 * 	```;
 *
 * @param event - DOM input or change event.
 * @returns Target value when it is a string, otherwise an empty string.
 */
export const readInputValue = (event: Event): string => {
	const { target } = event;

	if (
		typeof target === "object" &&
		target !== null &&
		"value" in target &&
		typeof target.value === "string"
	) {
		return target.value;
	}

	return "";
};

/**
 * Focus event carrying the element gaining focus, if any. Used to keep popups open when focus moves
 * inside them, such as from combobox input to option.
 */
export type FocusEvent = Event & {
	relatedTarget: EventTarget | null;
};

export type KeyboardEvent = Pick<globalThis.KeyboardEvent, "key" | "preventDefault"> & {
	ctrlKey?: boolean;
	metaKey?: boolean;
};
