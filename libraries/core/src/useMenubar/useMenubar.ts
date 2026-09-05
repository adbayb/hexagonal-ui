import type { KeyboardEvent } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { FrameworkPort } from "../shared/Port";
import type { Reactive } from "../shared/types";

import { navigateNext, navigatePrevious } from "../shared/navigation";

/**
 * Menubar pattern input.
 */
export type UseMenubarInput = {
	id: string;
	items: string[];
};

/**
 * Menubar pattern output.
 */
export type UseMenubarOutput = {
	activeItem: Reactive<string>;
	getMenubarAttributes: Reactive<{
		id: string;
		role: "menubar";
	}>;
	getMenuItemAttributes: (item: string) => Reactive<{
		id: string;
		onClick: () => void;
		onKeyDown: (event: KeyboardEvent) => void;
		role: "menuitem";
		tabIndex: -1 | 0;
	}>;
};

/**
 * Menubar pattern factory.
 * @param frameworkAdapter - Helpers.
 * @param frameworkAdapter.computed - Computed state factory.
 * @param frameworkAdapter.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 * @example
 * 	const useMenubar = createUseMenubar({ computed, state });
 */
export const createUseMenubar: PatternFactory<
	UseMenubarInput,
	UseMenubarOutput,
	Pick<FrameworkPort, "computed" | "state">
> = ({ computed, state }) => {
	return (input) => {
		const [activeItem, setActiveItem] = state(input.items.at(0) ?? "");
		const itemId = (item: string) => `${input.id}-${item}`;

		const handleKeyDownFor = (item: string) => (event: KeyboardEvent) => {
			const { items } = input;

			switch (event.key) {
				case " ":
				case "Enter": {
					event.preventDefault();

					setActiveItem(item);

					break;
				}
				case "ArrowLeft": {
					event.preventDefault();

					setActiveItem(navigatePrevious(items, activeItem()));

					break;
				}
				case "ArrowRight": {
					event.preventDefault();

					setActiveItem(navigateNext(items, activeItem()));

					break;
				}
				case "End": {
					event.preventDefault();

					const last = items.at(-1);

					if (last !== undefined) setActiveItem(last);

					break;
				}
				case "Home": {
					event.preventDefault();

					const first = items.at(0);

					if (first !== undefined) setActiveItem(first);

					break;
				}
			}
		};

		return {
			activeItem,
			getMenubarAttributes: computed(() => ({
				id: input.id,
				role: "menubar",
			})),
			getMenuItemAttributes: (item: string) =>
				computed(() => ({
					id: itemId(item),
					// eslint-disable-next-line sonarjs/no-nested-functions -- per-item computed needs the item closure for fine-grained reactivity
					onClick() {
						setActiveItem(item);
					},
					onKeyDown: handleKeyDownFor(item),
					role: "menuitem",
					tabIndex: item === activeItem() ? 0 : -1,
				})),
		};
	};
};
