import type { Pattern } from "../shared/Pattern";
import type { Reactive } from "../shared/types";

/**
 * Listbox element.
 */
export type Listbox = Pattern<{
	getListboxAttributes: Reactive<{
		"aria-activedescendant": string;
		"id": string;
		"role": "listbox";
		"tabIndex": 0;
	}>;
	getOptionAttributes: (value: string) => {
		"aria-selected": boolean;
		"id": string;
		"onClick": () => void;
		"role": "option";
	};
	selectedOption: Reactive<string>;
}>;
