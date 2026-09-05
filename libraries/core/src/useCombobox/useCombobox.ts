import type { Event, FocusEvent, KeyboardEvent } from "../shared/Event";
import { readInputValue } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { FrameworkPort } from "../shared/Port";
import type { Reactive } from "../shared/types";

/** Combobox pattern input. */
export type UseComboboxInput = {
	id: string;
	options: string[];
};

/** Combobox pattern output. */
export type UseComboboxOutput = {
	filteredOptions: Reactive<string[]>;
	getInputAttributes: Reactive<{
		"aria-autocomplete": "list";
		"aria-controls": string;
		"aria-expanded": boolean;
		"onBlur": (event: FocusEvent) => void;
		"onChange": (event: Event) => void;
		"onInput": (event: Event) => void;
		"onKeyDown": (event: KeyboardEvent) => void;
		"role": "combobox";
		"value": string;
	}>;
	getOptionAttributes: (value: string) => Reactive<{
		"id": string;
		"aria-selected": boolean;
		"onClick": () => void;
		"role": "option";
	}>;
	isOpen: Reactive<boolean>;
	selectedOption: Reactive<string>;
};

/**
 * Combobox pattern factory.
 *
 * @example
 * 	const useCombobox = createUseCombobox({ computed, state });
 *
 * @param frameworkAdapter - Helpers.
 * @param frameworkAdapter.computed - Computed state factory.
 * @param frameworkAdapter.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
export const createUseCombobox: PatternFactory<
	UseComboboxInput,
	UseComboboxOutput,
	Pick<FrameworkPort, "computed" | "state">
> = ({ computed, state }) => {
	return (input) => {
		const [inputValue, setInputValue] = state("");
		const [isOpen, setIsOpen] = state(false);
		const [selectedOption, setSelectedOption] = state("");

		const filteredOptions = computed(() => {
			return input.options.filter((option) => {
				return option.toLowerCase().includes(inputValue().toLowerCase());
			});
		});

		const selectOption = (value: string) => {
			setSelectedOption(value);
			setInputValue(value);
			setIsOpen(false);
		};

		const optionId = (value: string) => {
			return `${input.id}-${value}`;
		};

		const handleBlur = (event: FocusEvent) => {
			if (isPopupTarget(event.relatedTarget, `${input.id}-`)) {
				return;
			}

			setIsOpen(false);
		};

		const handleInput = (event: Event) => {
			const value = readInputValue(event);

			setInputValue(value);
			setIsOpen(value.length > 0);
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowDown": {
					event.preventDefault();
					setIsOpen(true);

					break;
				}
				case "Enter": {
					if (!isOpen()) {
						break;
					}

					event.preventDefault();

					const first = filteredOptions().at(0);

					if (first !== undefined) {
						selectOption(first);
					}

					break;
				}
				case "Escape": {
					if (!isOpen()) {
						break;
					}

					event.preventDefault();
					setIsOpen(false);

					break;
				}
				default: {
					break;
				}
			}
		};

		return {
			filteredOptions,
			getInputAttributes: computed(() => {
				return {
					"aria-autocomplete": "list",
					"aria-controls": input.id,
					"aria-expanded": isOpen(),
					"onBlur": handleBlur,
					"onChange": handleInput,
					"onInput": handleInput,
					"onKeyDown": handleKeyDown,
					"role": "combobox",
					"value": inputValue(),
				};
			}),
			getOptionAttributes: (value: string) => {
				return computed(() => {
					return {
						"id": optionId(value),
						"aria-selected": value === selectedOption(),
						// eslint-disable-next-line sonarjs/no-nested-functions -- per-item computed needs the value closure for fine-grained reactivity
						"onClick"() {
							selectOption(value);
						},
						"role": "option",
					};
				});
			},
			isOpen,
			selectedOption,
		};
	};
};

const isPopupTarget = (relatedTarget: EventTarget | null, prefix: string): boolean => {
	if (typeof relatedTarget !== "object" || relatedTarget === null) {
		return false;
	}

	if (!("id" in relatedTarget) || typeof relatedTarget.id !== "string") {
		return false;
	}

	return relatedTarget.id.startsWith(prefix);
};
