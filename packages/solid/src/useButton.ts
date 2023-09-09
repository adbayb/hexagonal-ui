import { createUseButton } from "@hexagonal-ui/core";
import { createSignal } from "solid-js";

export const useButton = createUseButton(createSignal);
