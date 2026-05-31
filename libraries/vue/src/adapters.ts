import type { FrameworkPort } from "@hexagonal-ui/core";

import { computed as computedVue, onMounted, onUnmounted, ref } from "vue";

const state: FrameworkPort["state"] = (initialState) => {
	const stateAsRef = ref(initialState);

	return [
		() => stateAsRef.value as typeof initialState,
		(value) => {
			stateAsRef.value = value;
		},
	] as const;
};

const computed: FrameworkPort["computed"] = (function_) => {
	const c = computedVue(function_);

	return () => c.value;
};

export const frameworkAdapter: FrameworkPort = {
	computed,
	lifecycle: { onDestroy: onUnmounted, onMount: onMounted },
	state,
};
