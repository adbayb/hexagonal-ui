import type { Event } from "../shared/Event";
import type { View } from "../shared/View";

/**
 * Button element
 */
export type Button = View<
	"button",
	{
		children: boolean | number | string;
		"aria-describedby"?: string;
		"aria-labelledby"?: string;
		"aria-disabled"?: boolean;
		"aria-pressed"?: boolean;
		onClick: (event: Event<HTMLButtonElement>) => void;
		role?: "button";
	}
>;
