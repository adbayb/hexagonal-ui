import type { Event } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { Reactive } from "../shared/types";

/**
 * Combobox pattern input.
 */
export type UseComboboxInput = {
	"aria-controls": string;
	"options": string[];
};

/**
 * Combobox pattern output.
 */
export type UseComboboxOutput = {
	filteredOptions: Reactive<string[]>;
	getInputAttributes: Reactive<{
		"aria-autocomplete": "list";
		"aria-controls": string;
		"aria-expanded": boolean;
		"onBlur": (event: Event) => void;
		"onChange": (event: Event) => void;
		"onInput": (event: Event) => void;
		"role": "combobox";
		"value": string;
	}>;
	getOptionAttributes: (value: string) => {
		"aria-selected": boolean;
		"onClick": () => void;
		"role": "option";
	};
	isOpen: Reactive<boolean>;
	selectedOption: Reactive<string>;
};

/**
 * Combobox pattern factory.
 * Combobox pattern factory.
 * @param input - Helpers.
 * @param input.computed - Computed state factory.
 * @param input.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 * @example
 * 	const useCombobox = createUseCombobox({
 * 		computed: computedAdapter,
 * 		lifecycle: {
 * 			onDestroy: useDestroy,
 * 			onMount: useMount,
 * 		},
 * 		state: useStateAdapter,
 * 	});
 */
export const createUseCombobox: PatternFactory<
	UseComboboxInput,
	UseComboboxOutput
> =
	({ computed, state }) =>
	(input) => {
		const [inputValue, setInputValue] = state("");
		const [isOpen, setIsOpen] = state(false);
		const [selectedOption, setSelectedOption] = state("");

		const filteredOptions = computed(() =>
			input.options.filter((option) =>
				option.toLowerCase().includes(inputValue().toLowerCase()),
			),
		);

		const handleInput = (event: Event) => {
			const value =
				(event.target as unknown as { value: string } | null)?.value ??
				"";

			setInputValue(value);
			setIsOpen(value.length > 0);
		};

		return {
			filteredOptions,
			getInputAttributes: computed(() => ({
				"aria-autocomplete": "list",
				"aria-controls": input["aria-controls"],
				"aria-expanded": isOpen(),
				"onBlur"() {
					setIsOpen(false);
				},
				"onChange": handleInput,
				"onInput": handleInput,
				"role": "combobox",
				"value": inputValue(),
			})),
			getOptionAttributes: (value: string) => ({
				"aria-selected": value === selectedOption(),
				"onClick"() {
					setSelectedOption(value);
					setIsOpen(false);
				},
				"role": "option",
			}),
			isOpen,
			selectedOption,
		};
	};
