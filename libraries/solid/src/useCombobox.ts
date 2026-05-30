import { createUseCombobox } from "@hexagonal-ui/core";
import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

export const useCombobox = createUseCombobox({
	computed: createMemo,
	lifecycle: { onDestroy: onCleanup, onMount },
	state: createSignal,
});
