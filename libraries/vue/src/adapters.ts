import type { FrameworkPort } from "@hexagonal-ui/core";

import {
	computed as computedVue,
	onMounted,
	onUnmounted,
	ref as refVue,
	watchEffect,
} from "vue";

const state: FrameworkPort["state"] = (initialState) => {
	const stateAsRef = refVue(initialState);

	return [
		() => stateAsRef.value as typeof initialState,
		(value) => {
			stateAsRef.value = value;
		},
	] as const;
};

const ref: FrameworkPort["ref"] = (initialValue = null) => {
	const referenceAsRef = refVue(initialValue);

	return [
		() => referenceAsRef.value as typeof initialValue,
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
const remapEventProps = <Value>(value: Value): Value => {
	if (value === null || typeof value !== "object" || Array.isArray(value)) {
		return value;
	}

	const remapped: Record<string, unknown> = {};

	for (const [key, property] of Object.entries(value)) {
		const fixed = /^onKey[A-Z]/.test(key)
			? `onKey${key.slice(5, 6).toLowerCase()}${key.slice(6)}`
			: key;

		if (!(fixed in remapped)) {
			remapped[fixed] = property;
		}
	}

	return remapped as Value;
};

const computed: FrameworkPort["computed"] = (function_) => {
	const c = computedVue(() => remapEventProps(function_()));

	return () => c.value;
};

export const frameworkAdapter: FrameworkPort = {
	computed,
	effect: watchEffect,
	lifecycle: { onDestroy: onUnmounted, onMount: onMounted },
	ref,
	state,
};
