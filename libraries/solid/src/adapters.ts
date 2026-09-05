import type { FrameworkPort } from "@hexagonal-ui/core";
import { createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";

export const frameworkAdapter: FrameworkPort = {
	ref: createSignal,
	computed: createMemo,
	effect: (effect) => {
		createEffect(() => {
			effect();
		});
	},
	lifecycle: {
		onDestroy: (callback) => {
			onCleanup(callback);
		},
		onMount,
	},
	state: createSignal,
};
