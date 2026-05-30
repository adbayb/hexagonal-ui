import type { PatternFactory } from "../shared/Pattern";
import type { Listbox } from "./Listbox";

/**
 * Listbox pattern factory.
 * @param input - Helpers.
 * @param input.computed - Computed state factory.
 * @param input.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 * @example
 * 	const useListbox = createUseListbox({
 * 		computed: computedAdapter,
 * 		lifecycle: {
 * 			onDestroy: useDestroy,
 * 			onMount: useMount,
 * 		},
 * 		state: useStateAdapter,
 * 	});
 */
export const createUseListbox: PatternFactory<
	{ id: string; options: string[] },
	Listbox
> =
	({ computed, state }) =>
	(input) => {
		const [selectedOption, setSelectedOption] = state("");
		const optionId = (value: string) => `${input.id}-${value}`;

		return {
			getListboxAttributes: computed(() => ({
				"aria-activedescendant": selectedOption()
					? optionId(selectedOption())
					: "",
				"id": input.id,
				"role": "listbox",
				"tabIndex": 0,
			})),
			getOptionAttributes: (value: string) => ({
				"aria-selected": value === selectedOption(),
				"id": optionId(value),
				"onClick"() {
					setSelectedOption(value);
				},
				"role": "option" as const,
			}),
			selectedOption,
		};
	};
