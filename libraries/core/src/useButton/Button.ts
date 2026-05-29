import type { Event } from "../shared/Event";
import type { State } from "../shared/types";
import type { View } from "../shared/View";

/**
 * Button element.
 */
export type Button = View<
	"button",
	{
		"aria-describedby": string;
		"aria-disabled": boolean;
		"aria-labelledby": string;
		"aria-pressed": boolean;
		"children": State<boolean | number | string>;
		"onClick": (event: Event) => void;
	}
>;
