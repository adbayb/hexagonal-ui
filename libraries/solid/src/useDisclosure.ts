import { createUseDisclosure } from "@hexagonal-ui/core";
import { createSignal, onCleanup, onMount } from "solid-js";

export const useDisclosure = createUseDisclosure({
	lifecycle: { onDestroy: onCleanup, onMount },
	state: createSignal,
});
