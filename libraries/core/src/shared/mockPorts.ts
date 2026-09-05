import type { Event, FocusEvent, KeyboardEvent } from "./Event";
import type { FrameworkPort } from "./Port";

/**
 * In-memory state port backed by a plain closure variable.
 *
 * @example
 * 	```ts
 * 	const [getCount, setCount] = mockState(0);
 * 	```;
 *
 * @param initialState - Initial value.
 * @returns Getter/setter tuple.
 */
const mockState: FrameworkPort["state"] = (initialState) => {
	let value = initialState;

	return [
		() => {
			return value;
		},
		(newValue) => {
			value = newValue;
		},
	] as const;
};

/**
 * In-memory ref port backed by a plain closure variable.
 *
 * @example
 * 	```ts
 * 	const [getNode, setNode] = mockReference(null);
 * 	```;
 *
 * @param initialValue - Initial referenced value.
 * @returns Getter/setter tuple.
 */
const mockReference = <Value>(
	initialValue: null | Value = null,
): readonly [() => null | Value, (newValue: null | Value) => void] => {
	let value: null | Value = initialValue;

	return [
		() => {
			return value;
		},
		(newValue) => {
			value = newValue;
		},
	] as const;
};

/**
 * In-memory ports for unit testing pattern factories as pure logic. No JSDOM or framework runtime
 * required.
 *
 * @example
 * 	```ts
 * 	const { ports } = createMockPorts();
 * 	const useDisclosure = createUseDisclosure(ports);
 * 	```;
 *
 * @returns Mock ports plus a helper to re-run collected effects.
 */
export const createMockPorts = () => {
	const effects: (() => unknown)[] = [];

	const ports: FrameworkPort = {
		ref: mockReference,
		computed: (function_) => {
			return function_;
		},
		effect: (effect) => {
			effects.push(effect);
			effect();
		},
		lifecycle: {
			onDestroy: () => {
				return undefined;
			},
			onMount: (callback) => {
				callback();
			},
		},
		state: mockState,
	};

	/**
	 * Runs collected effects again after state changes.
	 *
	 * @example
	 * 	```ts
	 * 	runEffects();
	 * 	```;
	 */
	const runEffects = () => {
		for (const effect of effects) {
			effect();
		}
	};

	return { ports, runEffects };
};

/**
 * Minimal keyboard event stub for pattern tests.
 *
 * @example
 * 	```ts
 * 	onKeyDown(mockKeyboardEvent("ArrowDown"));
 * 	```;
 *
 * @param key - Value for the `key` property.
 * @returns Stub event with a `preventDefault` no-op.
 */
export const mockKeyboardEvent = (key: string): KeyboardEvent => {
	return {
		key,
		preventDefault: () => {
			return undefined;
		},
	};
};

/**
 * Minimal event stub for pattern tests.
 *
 * @example
 * 	```ts
 * 	onClick(mockEvent());
 * 	```;
 *
 * @param type - Value for the `type` property.
 * @returns Stub event with no-op methods.
 */
export const mockEvent = (type = "click"): Event => {
	return {
		bubbles: false,
		cancelable: false,
		currentTarget: null,
		defaultPrevented: false,
		eventPhase: 0,
		isTrusted: false,
		preventDefault: () => {
			return undefined;
		},
		stopPropagation: () => {
			return undefined;
		},
		target: null,
		timeStamp: 0,
		type,
	};
};

/**
 * Minimal input event stub carrying a text value.
 *
 * @example
 * 	```ts
 * 	onInput(mockInputEvent("ap"));
 * 	```;
 *
 * @param value - Value exposed as `target.value`.
 * @returns Stub input event.
 */
export const mockInputEvent = (value: string): Event => {
	return {
		...mockEvent("input"),
		target: { value } as unknown as EventTarget,
	};
};

/**
 * Minimal focus event stub carrying the element gaining focus.
 *
 * @example
 * 	```ts
 * 	onBlur(mockFocusEvent());
 * 	```;
 *
 * @param relatedTarget - Element receiving focus, if any.
 * @returns Stub focus event.
 */
export const mockFocusEvent = (relatedTarget: EventTarget | null = null): FocusEvent => {
	return {
		...mockEvent("blur"),
		relatedTarget,
	};
};
