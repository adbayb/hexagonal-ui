import type { Event } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { FrameworkPort } from "../shared/Port";
import type { Reactive } from "../shared/types";

/** Button pattern input. */
export type UseButtonInput = {
	children: boolean | number | string;
	isDisabled?: boolean;
	onPress?: (event: Event) => void;
	type?: "button" | "reset" | "submit";
};

/** Button pattern output. */
export type UseButtonOutput = {
	getAttributes: Reactive<{
		"children": boolean | number | string;
		"aria-disabled": boolean;
		"aria-label": string;
		"onClick": (event: Event) => void;
		"role": "button";
		"type": "button" | "reset" | "submit";
	}>;
};

/**
 * Button pattern factory.
 *
 * @example
 * 	const useButton = createUseButton({ computed });
 *
 * @param frameworkAdapter - Helpers.
 * @param frameworkAdapter.computed - Computed state factory.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export const createUseButton: PatternFactory<
	UseButtonInput,
	UseButtonOutput,
	Pick<FrameworkPort, "computed">
> = ({ computed }) => {
	return (input) => {
		return {
			getAttributes: computed(() => {
				return {
					"children": input.children,
					"aria-disabled": input.isDisabled ?? false,
					"aria-label": String(input.children),
					"onClick"(event) {
						if (input.isDisabled) {
							event.preventDefault();

							return;
						}

						input.onPress?.(event);
					},
					"role": "button",
					"type": input.type ?? "button",
				};
			}),
		};
	};
};
