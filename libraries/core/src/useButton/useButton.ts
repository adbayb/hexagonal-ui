import type { PatternFactory } from "../shared/Pattern";
import type { Button } from "./Button";

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
export const createUseButton: PatternFactory<
	{ children: boolean | number | string; isDisabled: boolean },
	Button
> =
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
