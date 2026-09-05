import type { KeyboardEvent } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { FrameworkPort } from "../shared/Port";
import type { Reactive } from "../shared/types";

import { navigateNext, navigatePrevious } from "../shared/navigation";

/**
 * Select pattern input. `id` is the listbox id; the trigger id defaults to
 * `${id}-trigger` when omitted.
 */
export type UseSelectInput = {
	id: string;
	options: string[];
	triggerId?: string;
};

/**
 * Select pattern output.
 */
export type UseSelectOutput = {
	activeOption: Reactive<string>;
	getListboxAttributes: Reactive<{
		"aria-activedescendant": string;
		"id": string;
		"onKeyDown": (event: KeyboardEvent) => void;
		"role": "listbox";
		"tabIndex": -1;
	}>;
	getOptionAttributes: (value: string) => Reactive<{
		"aria-selected": boolean;
		"id": string;
		"onClick": () => void;
		"role": "option";
	}>;
	getTriggerAttributes: Reactive<{
		"aria-controls": string;
		"aria-expanded": boolean;
		"aria-haspopup": "listbox";
		"id": string;
		"onClick": () => void;
		"onKeyDown": (event: KeyboardEvent) => void;
		"role": "button";
	}>;
	isOpen: Reactive<boolean>;
	selectedOption: Reactive<string>;
};

/**
 * Select pattern factory. Composes a button-like trigger with a listbox
 * popup, reusing the shared list navigation helpers.
 * @param frameworkAdapter - Helpers.
 * @param frameworkAdapter.computed - Computed state factory.
 * @param frameworkAdapter.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ (select-only)
 * @example
 * 	const useSelect = createUseSelect({ computed, state });
 */
export const createUseSelect: PatternFactory<
	UseSelectInput,
	UseSelectOutput,
	Pick<FrameworkPort, "computed" | "state">
> = ({ computed, state }) => {
	return (input) => {
		const [isOpen, setIsOpen] = state(false);
		const [activeOption, setActiveOption] = state("");
		const [selectedOption, setSelectedOption] = state("");
		const optionId = (value: string) => `${input.id}-${value}`;
		const triggerId = input.triggerId ?? `${input.id}-trigger`;

		const open = (value: string) => {
			setIsOpen(true);
			setActiveOption(value);
		};

		const openAtSelected = (fallback: string | undefined) => {
			open(selectedOption() === "" ? (fallback ?? "") : selectedOption());
		};

		const close = () => {
			setIsOpen(false);
			setActiveOption("");
		};

		const commitSelection = (value: string) => {
			if (value === "") return;

			setSelectedOption(value);
			close();
		};

		const handleTriggerKeyDown = (event: KeyboardEvent) => {
			const { options } = input;

			switch (event.key) {
				case " ":
				case "ArrowDown":
				case "Enter": {
					event.preventDefault();

					if (isOpen()) {
						commitSelection(activeOption());
					} else {
						openAtSelected(options.at(0));
					}

					break;
				}
				case "ArrowUp": {
					event.preventDefault();

					if (isOpen()) {
						setActiveOption(
							navigatePrevious(options, activeOption()),
						);
					} else {
						openAtSelected(options.at(-1));
					}

					break;
				}
				case "Escape": {
					event.preventDefault();

					close();

					break;
				}
			}
		};

		const handleListboxKeyDown = (event: KeyboardEvent) => {
			const { options } = input;

			switch (event.key) {
				case " ":
				case "Enter": {
					event.preventDefault();

					commitSelection(activeOption());

					break;
				}
				case "ArrowDown": {
					event.preventDefault();

					setActiveOption(navigateNext(options, activeOption()));

					break;
				}
				case "ArrowUp": {
					event.preventDefault();

					setActiveOption(navigatePrevious(options, activeOption()));

					break;
				}
				case "End": {
					event.preventDefault();

					const last = options.at(-1);

					if (last !== undefined) setActiveOption(last);

					break;
				}
				case "Escape": {
					event.preventDefault();

					close();

					break;
				}
				case "Home": {
					event.preventDefault();

					const first = options.at(0);

					if (first !== undefined) setActiveOption(first);

					break;
				}
			}
		};

		return {
			activeOption,
			getListboxAttributes: computed(() => ({
				"aria-activedescendant": activeOption()
					? optionId(activeOption())
					: "",
				"id": input.id,
				"onKeyDown": handleListboxKeyDown,
				"role": "listbox",
				"tabIndex": -1,
			})),
			getOptionAttributes: (value: string) =>
				computed(() => ({
					"aria-selected": value === selectedOption(),
					"id": optionId(value),
					// eslint-disable-next-line sonarjs/no-nested-functions -- per-item computed needs the value closure for fine-grained reactivity
					"onClick"() {
						commitSelection(value);
					},
					"role": "option",
				})),
			getTriggerAttributes: computed(() => ({
				"aria-controls": input.id,
				"aria-expanded": isOpen(),
				"aria-haspopup": "listbox",
				"id": triggerId,
				"onClick"() {
					if (isOpen()) {
						close();
					} else {
						openAtSelected(input.options.at(0));
					}
				},
				"onKeyDown": handleTriggerKeyDown,
				"role": "button",
			})),
			isOpen,
			selectedOption,
		};
	};
};
