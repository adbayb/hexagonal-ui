import type { FrameworkPort } from "@hexagonal-ui/core";

import {
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js";

export const frameworkAdapter: FrameworkPort = {
	computed: createMemo,
	effect: createEffect,
	lifecycle: { onDestroy: onCleanup, onMount },
	ref: createSignal,
	state: createSignal,
};
