import type { Event } from "../shared/Event";
import type { Pattern } from "../shared/Pattern";
import type { Reactive } from "../shared/types";

/**
 * Button element.
 */
export type Button = Pattern<{
	getAttributes: Reactive<{
		"aria-disabled": boolean;
		"aria-label": string;
		"children": boolean | number | string;
		"onClick": (event: Event) => void;
		"role": "button";
		"type": "button" | "reset" | "submit";
	}>;
}>;
