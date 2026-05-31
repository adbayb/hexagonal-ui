import type { Event } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { Reactive } from "../shared/types";

/**
 * Button pattern input.
 */
export type UseButtonInput = {
	children: boolean | number | string;
	isDisabled: boolean;
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
 * @param input - Helpers.
 * @param input.computed - Computed state factory.
 * @param input.lifecycle - Lifecycle functions.
 * @param input.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 * @example
 * 	const useButton = createUseButton({
 * 		computed: computedAdapter,
 * 		lifecycle: {
 * 			onDestroy: useDestroy,
 * 			onMount: useMount,
 * 		},
 * 		state: useStateAdapter,
 * 	});
 */
export const createUseButton: PatternFactory<UseButtonInput, UseButtonOutput> =
	({ computed, lifecycle, state }) =>
	(input) => {
		const [children, setChildren] = state(input.children);

		lifecycle.onMount(() => {
			console.log("useButton mounted");
		});

		lifecycle.onDestroy(() => {
			console.log("useButton destroyed");
		});

		return {
			getAttributes: computed(() => ({
				"aria-disabled": false,
				"aria-label": String(children()),
				"children": children(),
				"onClick"(event) {
					setChildren(`Mutated after ${event.type}`);
				},
				"role": "button",
				"type": "button",
			})),
		};
	};
