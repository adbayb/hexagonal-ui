import type { View } from "./View";
import type { Event } from "./types";

export type Button = View<
	"button",
	{
		children: boolean | number | string;
		"aria-describedby"?: string;
		"aria-labelledby"?: string;
		"aria-disabled"?: boolean;
		"aria-pressed"?: boolean;
		onClick: (event: Event<HTMLButtonElement>) => void;
	}
>;
