import type { UnwrapRef } from "vue";

import { createUseButton } from "@hexagonal-ui/core";
import { onMounted, onUnmounted, ref } from "vue";

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

export const useButton = createUseButton({
	lifecycle: { onDestroy: onUnmounted, onMount: onMounted },
	state: useStateAdapter,
});
