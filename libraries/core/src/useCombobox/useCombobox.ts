import type { Event, FocusEvent, KeyboardEvent } from "../shared/Event";
import { readInputValue } from "../shared/Event";
import { navigateNext, navigatePrevious } from "../shared/navigation";
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
	activeOption: Reactive<string>;
	filteredOptions: Reactive<string[]>;
	getInputAttributes: Reactive<{
		"aria-activedescendant": string;
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
		const [activeOption, setActiveOption] = state("");
		const [selectedOption, setSelectedOption] = state("");

		const filterOptions = (query: string) => {
			return input.options.filter((option) => {
				return option.toLowerCase().includes(query.toLowerCase());
			});
		};

		const filteredOptions = computed(() => {
			return filterOptions(inputValue());
		});

		const close = () => {
			setIsOpen(false);
			setActiveOption("");
		};

		const selectOption = (value: string) => {
			setSelectedOption(value);
			setInputValue(value);
			close();
		};

		const optionId = (value: string) => {
			return `${input.id}-${value}`;
		};

		const handleBlur = (event: FocusEvent) => {
			if (isPopupTarget(event.relatedTarget, `${input.id}-`)) {
				return;
			}

			close();
		};

		const handleInput = (event: Event) => {
			const value = readInputValue(event);

			setInputValue(value);
			setIsOpen(value.length > 0);
			setActiveOption(value.length > 0 ? (filterOptions(value).at(0) ?? "") : "");
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowDown": {
					event.preventDefault();

					if (isOpen()) {
						setActiveOption(navigateNext(filteredOptions(), activeOption()));
					} else {
						setIsOpen(true);
						setActiveOption(filteredOptions().at(0) ?? "");
					}

					break;
				}
				case "ArrowUp": {
					event.preventDefault();

					if (isOpen()) {
						setActiveOption(navigatePrevious(filteredOptions(), activeOption()));
					} else {
						setIsOpen(true);
						setActiveOption(filteredOptions().at(-1) ?? "");
					}

					break;
				}
				case "Enter": {
					if (!isOpen()) {
						break;
					}

					event.preventDefault();

					const value =
						activeOption() === "" ? (filteredOptions().at(0) ?? "") : activeOption();

					if (value !== "") {
						selectOption(value);
					}

					break;
				}
				case "Escape": {
					if (!isOpen()) {
						break;
					}

					event.preventDefault();
					close();

					break;
				}
				default: {
					break;
				}
			}
		};

		return {
			activeOption,
			filteredOptions,
			getInputAttributes: computed(() => {
				return {
					"aria-activedescendant": activeOption() ? optionId(activeOption()) : "",
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
