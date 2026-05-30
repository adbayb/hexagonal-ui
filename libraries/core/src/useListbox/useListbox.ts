import type { KeyboardEvent } from "../shared/Event";
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

		const handleKeyDown = (event: KeyboardEvent) => {
			const { options } = input;

			switch (event.key) {
				case " ": {
					event.preventDefault();

					break;
				}
				case "ArrowDown": {
					event.preventDefault();

					setSelectedOption(navigateNext(options, selectedOption()));

					break;
				}
				case "ArrowUp": {
					event.preventDefault();

					setSelectedOption(
						navigatePrevious(options, selectedOption()),
					);

					break;
				}
				case "End": {
					event.preventDefault();

					const last = options.at(-1);

					if (last !== undefined) setSelectedOption(last);

					break;
				}
				case "Enter": {
					event.preventDefault();

					break;
				}
				case "Home": {
					event.preventDefault();

					const first = options.at(0);

					if (first !== undefined) setSelectedOption(first);

					break;
				}
			}
		};

		return {
			getListboxAttributes: computed(() => ({
				"aria-activedescendant": selectedOption()
					? optionId(selectedOption())
					: "",
				"id": input.id,
				"onKeyDown": handleKeyDown,
				"role": "listbox",
				"tabIndex": 0,
			})),
			getOptionAttributes: (value: string) => ({
				"aria-selected": value === selectedOption(),
				"id": optionId(value),
				"onClick"() {
					setSelectedOption(value);
				},
				"role": "option",
			}),
			selectedOption,
		};
	};

const navigateNext = (options: string[], current: string): string => {
	const index = options.indexOf(current);
	const next = index === -1 || index === options.length - 1 ? 0 : index + 1;

	return options[next] ?? current;
};

const navigatePrevious = (options: string[], current: string): string => {
	const index = options.indexOf(current);
	const previous = index <= 0 ? options.length - 1 : index - 1;

	return options[previous] ?? current;
};
