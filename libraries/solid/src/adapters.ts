import type { FrameworkPort } from "@hexagonal-ui/core";

import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

export const frameworkAdapter: FrameworkPort = {
	computed: createMemo,
	lifecycle: { onDestroy: onCleanup, onMount },
	state: createSignal,
};
