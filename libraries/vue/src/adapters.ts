import type { Ports } from "@hexagonal-ui/core";
import type { UnwrapRef } from "vue";

import { computed, onMounted, onUnmounted, ref } from "vue";

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export const useStateAdapter = <Value>(initialState: Value) => {
	const state = ref(initialState);

	return [
		() => state.value as Value,
		(value: Value) => {
			state.value = value as UnwrapRef<Value>;
		},
	] as const;
};

export const computedAdapter = <Value>(function_: () => Value) => {
	const c = computed(function_);

	return () => c.value;
};

export const ports: Ports = {
	computed: computedAdapter,
	lifecycle: { onDestroy: onUnmounted, onMount: onMounted },
	state: useStateAdapter,
};
