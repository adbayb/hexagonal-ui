import { createUseButton } from "@hexagonal-ui/core";
import { createSignal, onCleanup, onMount } from "solid-js";

export const useButton = createUseButton({
	lifecycle: { onMount, onDestroy: onCleanup },
	state: createSignal,
});
