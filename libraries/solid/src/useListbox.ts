import { createUseListbox } from "@hexagonal-ui/core";
import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

export const useListbox = createUseListbox({
	computed: createMemo,
	lifecycle: { onDestroy: onCleanup, onMount },
	state: createSignal,
});
