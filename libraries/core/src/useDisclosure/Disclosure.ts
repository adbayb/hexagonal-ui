import type { Pattern } from "../shared/Pattern";
import type { Reactive } from "../shared/types";

/**
 * Disclosure element.
 */
export type Disclosure = Pattern<{
	getTriggerAttributes: Reactive<{
		"aria-controls": string;
		"aria-expanded": boolean;
		"id": string;
		"onClick": () => void;
		"role": "button";
	}>;
	isOpen: Reactive<boolean>;
}>;
