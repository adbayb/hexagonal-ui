import { createUseButton } from "@hexagonal-ui/core";
import type { UnwrapRef } from "vue";
import { onMounted, onUnmounted, ref } from "vue";

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
	lifecycle: { onMount: onMounted, onDestroy: onUnmounted },
	state: useStateAdapter,
});
