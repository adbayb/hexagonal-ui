import type { Event } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { FrameworkPort } from "../shared/Port";
import type { Reactive } from "../shared/types";

/**
 * Button pattern input.
 */
export type UseButtonInput = {
	children: boolean | number | string;
	isDisabled?: boolean;
	onPress?: (event: Event) => void;
	type?: "button" | "reset" | "submit";
};

/**
 * Button pattern output.
 */
export type UseButtonOutput = {
	getAttributes: Reactive<{
		"aria-disabled": boolean;
		"aria-label": string;
		"children": boolean | number | string;
		"onClick": (event: Event) => void;
		"role": "button";
		"type": "button" | "reset" | "submit";
	}>;
};

/**
 * Button pattern factory.
 * @param frameworkAdapter - Helpers.
 * @param frameworkAdapter.computed - Computed state factory.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 * @example
 * 	const useButton = createUseButton({ computed });
 */
export const createUseButton: PatternFactory<
	UseButtonInput,
	UseButtonOutput,
	Pick<FrameworkPort, "computed">
> = ({ computed }) => {
	return (input) => {
		return {
			getAttributes: computed(() => ({
				"aria-disabled": input.isDisabled ?? false,
				"aria-label": String(input.children),
				"children": input.children,
				"onClick"(event) {
					if (input.isDisabled) {
						event.preventDefault();

						return;
					}

					input.onPress?.(event);
				},
				"role": "button",
				"type": input.type ?? "button",
			})),
		};
	};
};
