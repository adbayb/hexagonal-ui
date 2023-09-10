import { createUseButton } from "@hexagonal-ui/core";
import type { UnwrapRef } from "vue";
import { onMounted, onUnmounted, ref } from "vue";

export const useButton = createUseButton({
	lifecycle: { onMount: onMounted, onDestroy: onUnmounted },
	state: (initialState) => {
		const state = ref(initialState);

		return [
			() => state.value as typeof initialState,
			(value) => {
				state.value = value as UnwrapRef<typeof initialState>;
			},
		] as const;
	},
});
