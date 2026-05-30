import type { UnwrapRef } from "vue";

import { createUseListbox } from "@hexagonal-ui/core";
import { computed, onMounted, onUnmounted, ref } from "vue";

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
const useStateAdapter = <Value>(initialState: Value) => {
	const state = ref(initialState);

	return [
		() => state.value as Value,
		(value: Value) => {
			state.value = value as UnwrapRef<Value>;
		},
	] as const;
};

const computedAdapter = <Value>(function_: () => Value) => {
	const c = computed(function_);

	return () => c.value;
};

export const useListbox = createUseListbox({
	computed: computedAdapter,
	lifecycle: { onDestroy: onUnmounted, onMount: onMounted },
	state: useStateAdapter,
});
