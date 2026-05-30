import type { KeyboardEvent } from "../shared/Event";
import type { Pattern } from "../shared/Pattern";
import type { Reactive } from "../shared/types";

/**
 * Menubar element.
 */
export type Menubar = Pattern<{
	activeItem: Reactive<string>;
	getMenubarAttributes: Reactive<{
		id: string;
		role: "menubar";
	}>;
	getMenuItemAttributes: (item: string) => {
		id: string;
		onClick: () => void;
		onKeyDown: (event: KeyboardEvent) => void;
		role: "menuitem";
		tabIndex: -1 | 0;
	};
}>;
