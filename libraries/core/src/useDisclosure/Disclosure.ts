import type { Event } from "../shared/Event";
import type { State } from "../shared/types";
import type { View } from "../shared/View";

/**
 * Disclosure element (trigger).
 */
export type Disclosure = View<
	"button",
	{
		"aria-controls": string;
		"id": string;
		"isOpen": State<boolean>;
		"onClick": (event: Event) => void;
	}
>;
