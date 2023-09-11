import type { View } from "../shared/View";
import type { Event } from "../shared/Event";
import type { State } from "../shared/types";

/**
 * Button element
 */
export type Button = View<
	"button",
	{
		"aria-describedby": string;
		"aria-labelledby": string;
		"aria-disabled": boolean;
		"aria-pressed": boolean;
		onClick: (event: Event) => void;
		children: State<boolean | number | string>;
	}
>;
