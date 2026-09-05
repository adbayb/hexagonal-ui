import type { Event, FocusEvent, KeyboardEvent } from "./Event";
import type { FrameworkPort } from "./Port";

/**
 * In-memory state port backed by a plain closure variable.
 * @param initialState - Initial value.
 * @returns Getter/setter tuple.
 * @example
 * ```ts
 * const [getCount, setCount] = mockState(0);
 * ```
 */
const mockState: FrameworkPort["state"] = (initialState) => {
	let value = initialState;

	return [
		() => value,
		(newValue) => {
			value = newValue;
		},
	] as const;
};

/**
 * In-memory ref port backed by a plain closure variable.
 * @param initialValue - Initial referenced value.
 * @returns Getter/setter tuple.
 * @example
 * ```ts
 * const [getNode, setNode] = mockReference(null);
 * ```
 */
const mockReference: FrameworkPort["ref"] = (initialValue = null) => {
	let value = initialValue;

	return [
		() => value,
		(newValue) => {
			value = newValue;
		},
	] as const;
};

/**
 * In-memory ports for unit testing pattern factories as pure logic.
 * No JSDOM or framework runtime required.
 * @returns Mock ports plus a helper to re-run collected effects.
 * @example
 * ```ts
 * const { ports } = createMockPorts();
 * const useDisclosure = createUseDisclosure(ports);
 * ```
 */
export const createMockPorts = () => {
	const effects: (() => unknown)[] = [];

	const ports: FrameworkPort = {
		computed: (function_) => function_,
		effect: (effect) => {
			effects.push(effect);
			effect();
		},
		lifecycle: {
			onDestroy: () => undefined,
			onMount: (callback) => {
				callback();
			},
		},
		ref: mockReference,
		state: mockState,
	};

	/**
	 * Runs collected effects again after state changes.
	 * @example
	 * ```ts
	 * runEffects();
	 * ```
	 */
	const runEffects = () => {
		for (const effect of effects) effect();
	};

	return { ports, runEffects };
};

/**
 * Minimal keyboard event stub for pattern tests.
 * @param key - Value for the `key` property.
 * @returns Stub event with a `preventDefault` no-op.
 * @example
 * ```ts
 * onKeyDown(mockKeyboardEvent("ArrowDown"));
 * ```
 */
export const mockKeyboardEvent = (key: string): KeyboardEvent => ({
	key,
	preventDefault: () => undefined,
});

/**
 * Minimal event stub for pattern tests.
 * @param type - Value for the `type` property.
 * @returns Stub event with no-op methods.
 * @example
 * ```ts
 * onClick(mockEvent());
 * ```
 */
export const mockEvent = (type = "click"): Event => ({
	bubbles: false,
	cancelable: false,
	currentTarget: null,
	defaultPrevented: false,
	eventPhase: 0,
	isTrusted: false,
	preventDefault: () => undefined,
	stopPropagation: () => undefined,
	target: null,
	timeStamp: 0,
	type,
});

/**
 * Minimal input event stub carrying a text value.
 * @param value - Value exposed as `target.value`.
 * @returns Stub input event.
 * @example
 * ```ts
 * onInput(mockInputEvent("ap"));
 * ```
 */
export const mockInputEvent = (value: string): Event => ({
	...mockEvent("input"),
	target: { value } as unknown as EventTarget,
});

/**
 * Minimal focus event stub carrying the element gaining focus.
 * @param relatedTarget - Element receiving focus, if any.
 * @returns Stub focus event.
 * @example
 * ```ts
 * onBlur(mockFocusEvent());
 * ```
 */
export const mockFocusEvent = (
	relatedTarget: EventTarget | null = null,
): FocusEvent => ({
	...mockEvent("blur"),
	relatedTarget,
});
