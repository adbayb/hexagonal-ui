import type { KeyboardEvent } from "../shared/Event";
import { navigateNext, navigatePrevious } from "../shared/navigation";
import type { PatternFactory } from "../shared/Pattern";
import type { FrameworkPort } from "../shared/Port";
import type { Reactive } from "../shared/types";

/** Listbox pattern input. */
export type UseListboxInput = {
	id: string;
	options: string[];
};

/** Listbox pattern output. */
export type UseListboxOutput = {
	activeOption: Reactive<string>;
	getListboxAttributes: Reactive<{
		"id": string;
		"aria-activedescendant": string;
		"onKeyDown": (event: KeyboardEvent) => void;
		"role": "listbox";
		"tabIndex": 0;
	}>;
	getOptionAttributes: (value: string) => Reactive<{
		"id": string;
		"aria-selected": boolean;
		"onClick": () => void;
		"role": "option";
	}>;
	selectedOption: Reactive<string>;
};

/**
 * Listbox pattern factory.
 *
 * @example
 * 	const useListbox = createUseListbox({ computed, state });
 *
 * @param frameworkAdapter - Helpers.
 * @param frameworkAdapter.computed - Computed state factory.
 * @param frameworkAdapter.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */
export const createUseListbox: PatternFactory<
	UseListboxInput,
	UseListboxOutput,
	Pick<FrameworkPort, "computed" | "state">
> = ({ computed, state }) => {
	return (input) => {
		const [activeOption, setActiveOption] = state("");
		const [selectedOption, setSelectedOption] = state("");

		const optionId = (value: string) => {
			return `${input.id}-${value}`;
		};

		const commitSelection = (value: string) => {
			if (value === "") {
				return;
			}

			setActiveOption(value);
			setSelectedOption(value);
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			const { options } = input;

			switch (event.key) {
				case " ":
				case "Enter": {
					event.preventDefault();

					if (activeOption() !== "") {
						setSelectedOption(activeOption());
					}

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

					if (last !== undefined) {
						setActiveOption(last);
					}

					break;
				}
				case "Home": {
					event.preventDefault();

					const first = options.at(0);

					if (first !== undefined) {
						setActiveOption(first);
					}

					break;
				}
				default: {
					break;
				}
			}
		};

		return {
			activeOption,
			getListboxAttributes: computed(() => {
				return {
					"id": input.id,
					"aria-activedescendant": activeOption() ? optionId(activeOption()) : "",
					"onKeyDown": handleKeyDown,
					"role": "listbox",
					"tabIndex": 0,
				};
			}),
			getOptionAttributes: (value: string) => {
				return computed(() => {
					return {
						"id": optionId(value),
						"aria-selected": value === selectedOption(),
						// eslint-disable-next-line sonarjs/no-nested-functions -- per-item computed needs the value closure for fine-grained reactivity
						"onClick"() {
							commitSelection(value);
						},
						"role": "option",
					};
				});
			},
			selectedOption,
		};
	};
};
