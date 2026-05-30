import type { Event } from "../shared/Event";
import type { Pattern } from "../shared/Pattern";
import type { Reactive } from "../shared/types";

/**
 * Combobox element.
 */
export type Combobox = Pattern<{
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
}>;
