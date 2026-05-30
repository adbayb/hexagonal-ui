import { createUseButton } from "@hexagonal-ui/core";
import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

export const useButton = createUseButton({
	computed: createMemo,
	lifecycle: { onDestroy: onCleanup, onMount },
	state: createSignal,
});
