import type { Ports } from "@hexagonal-ui/core";

import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

export const ports: Ports = {
	computed: createMemo,
	lifecycle: { onDestroy: onCleanup, onMount },
	state: createSignal,
};
