import type { View } from "./View";

export type Button = View<
	"button",
	{
		children: boolean | number | string;
		"aria-describedby"?: string;
		"aria-labelledby"?: string;
		"aria-disabled"?: boolean;
		"aria-pressed"?: boolean;
	}
>;
