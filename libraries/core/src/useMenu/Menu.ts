import type { KeyboardEvent } from "../shared/Event";
import type { Pattern } from "../shared/Pattern";
import type { Reactive } from "../shared/types";

/**
 * Menu element.
 */
export type Menu = Pattern<{
	activeItem: Reactive<string>;
	getMenuAttributes: Reactive<{
		"aria-activedescendant": string;
		"id": string;
		"onKeyDown": (event: KeyboardEvent) => void;
		"role": "menu";
		"tabIndex": -1;
	}>;
	getMenuItemAttributes: (item: string) => {
		id: string;
		onClick: () => void;
		role: "menuitem";
		tabIndex: -1;
	};
	getTriggerAttributes: Reactive<{
		"aria-controls": string;
		"aria-expanded": boolean;
		"aria-haspopup": "menu";
		"id": string;
		"onClick": () => void;
		"onKeyDown": (event: KeyboardEvent) => void;
		"role": "button";
	}>;
	isOpen: Reactive<boolean>;
}>;
