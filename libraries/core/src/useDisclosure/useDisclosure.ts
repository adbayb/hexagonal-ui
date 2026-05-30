import type { PatternFactory } from "../shared/Pattern";
import type { Disclosure } from "./Disclosure";

/**
 * Disclosure pattern factory.
 * @param input - Helpers.
 * @param input.computed - Computed state factory.
 * @param input.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 * @example
 * 	const useDisclosure = createUseDisclosure({
 * 		computed: computedAdapter,
 * 		lifecycle: {
 * 			onDestroy: useDestroy,
 * 			onMount: useMount,
 * 		},
 * 		state: useStateAdapter,
 * 	});
 */
export const createUseDisclosure: PatternFactory<
	{ "aria-controls": string; "id": string },
	Disclosure
> =
	({ computed, state }) =>
	(input) => {
		const [isOpen, setIsOpen] = state(false);

		return {
			getTriggerAttributes: computed(() => ({
				"aria-controls": input["aria-controls"],
				"aria-expanded": isOpen(),
				"id": input.id,
				"onClick"() {
					setIsOpen(!isOpen());
				},
				"role": "button",
			})),
			isOpen,
		};
	};
