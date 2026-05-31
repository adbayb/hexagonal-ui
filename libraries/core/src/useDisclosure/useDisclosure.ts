import type { PatternFactory } from "../shared/Pattern";
import type { Reactive } from "../shared/types";

/**
 * Disclosure pattern input.
 */
export type UseDisclosureInput = {
	"aria-controls": string;
	"id": string;
};

/**
 * Disclosure pattern output.
 */
export type UseDisclosureOutput = {
	getTriggerAttributes: Reactive<{
		"aria-controls": string;
		"aria-expanded": boolean;
		"id": string;
		"onClick": () => void;
		"role": "button";
	}>;
	isOpen: Reactive<boolean>;
};

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
	UseDisclosureInput,
	UseDisclosureOutput
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
