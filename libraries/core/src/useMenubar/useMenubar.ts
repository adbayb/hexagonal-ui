import type { KeyboardEvent } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { Menubar } from "./Menubar";

const navigateNext = (items: string[], current: string): string => {
	const index = items.indexOf(current);
	const next = index === -1 || index === items.length - 1 ? 0 : index + 1;

	return items[next] ?? current;
};

const navigatePrevious = (items: string[], current: string): string => {
	const index = items.indexOf(current);
	const previous = index <= 0 ? items.length - 1 : index - 1;

	return items[previous] ?? current;
};

/**
 * Menubar pattern factory.
 * @param input - Helpers.
 * @param input.computed - Computed state factory.
 * @param input.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 * @example
 * 	const useMenubar = createUseMenubar({
 * 		computed: computedAdapter,
 * 		lifecycle: {
 * 			onDestroy: useDestroy,
 * 			onMount: useMount,
 * 		},
 * 		state: useStateAdapter,
 * 	});
 */
export const createUseMenubar: PatternFactory<
	{ id: string; items: string[] },
	Menubar
> =
	({ computed, state }) =>
	(input) => {
		const [activeItem, setActiveItem] = state(input.items.at(0) ?? "");
		const itemId = (item: string) => `${input.id}-${item}`;

		const handleKeyDown = (event: KeyboardEvent) => {
			const { items } = input;

			switch (event.key) {
				case " ":
				case "Enter": {
					event.preventDefault();

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
			getMenuItemAttributes: (item: string) => ({
				id: itemId(item),
				onClick() {
					setActiveItem(item);
				},
				onKeyDown: handleKeyDown,
				role: "menuitem",
				tabIndex: item === activeItem() ? 0 : -1,
			}),
		};
	};
