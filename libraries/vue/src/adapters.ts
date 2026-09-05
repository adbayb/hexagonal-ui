import type { FrameworkPort } from "@hexagonal-ui/core";
import { computed as computedVue, onMounted, onUnmounted, ref as refVue, watchEffect } from "vue";

const state: FrameworkPort["state"] = (initialState) => {
	const stateAsRef = refVue(initialState);

	return [
		() => {
			return stateAsRef.value as typeof initialState;
		},
		(value) => {
			stateAsRef.value = value;
		},
	] as const;
};

const ref = <Value>(
	initialValue: null | Value = null,
): readonly [() => null | Value, (newValue: null | Value) => void] => {
	const referenceAsRef = refVue<null | Value>(initialValue);

	return [
		() => {
			return referenceAsRef.value as typeof initialValue;
		},
		(value) => {
			referenceAsRef.value = value;
		},
	] as const;
};

/*
 * Vue JSX hyphenates event prop names (`onKeyDown` → `key-down`, never fires).
 * Remap framework-level keyboard handlers to the working `onKeydown` spelling
 * so examples can spread attributes directly like React/Solid.
 */
const KEY_HANDLER_PATTERN = /^onKey[A-Z]/u;

const remapEventProps = <Value>(value: Value): Value => {
	if (value === null || typeof value !== "object" || Array.isArray(value)) {
		return value;
	}

	const remapped: Record<string, unknown> = {};

	for (const [key, property] of Object.entries(value)) {
		const fixed = KEY_HANDLER_PATTERN.test(key)
			? `onKey${key.slice(5, 6).toLowerCase()}${key.slice(6)}`
			: key;

		if (!(fixed in remapped)) {
			remapped[fixed] = property;
		}
	}

	return remapped as Value;
};

const computed: FrameworkPort["computed"] = (function_) => {
	const c = computedVue(() => {
		return remapEventProps(function_());
	});

	return () => {
		return c.value;
	};
};

export const frameworkAdapter: FrameworkPort = {
	ref,
	computed,
	effect: (effect) => {
		watchEffect(() => {
			effect();
		});
	},
	lifecycle: { onDestroy: onUnmounted, onMount: onMounted },
	state,
};
