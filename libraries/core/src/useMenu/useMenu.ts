import type { KeyboardEvent } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { Menu } from "./Menu";

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
 * Menu pattern factory.
 * @param input - Helpers.
 * @param input.computed - Computed state factory.
 * @param input.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menu/
 * @example
 * 	const useMenu = createUseMenu({
 * 		computed: computedAdapter,
 * 		lifecycle: {
 * 			onDestroy: useDestroy,
 * 			onMount: useMount,
 * 		},
 * 		state: useStateAdapter,
 * 	});
 */
export const createUseMenu: PatternFactory<
	{ id: string; items: string[]; triggerId: string },
	Menu
> =
	({ computed, state }) =>
	(input) => {
		const [isOpen, setIsOpen] = state(false);
		const [activeItem, setActiveItem] = state("");
		const itemId = (item: string) => `${input.id}-${item}`;

		const open = (item: string) => {
			setIsOpen(true);
			setActiveItem(item);
		};

		const close = () => {
			setIsOpen(false);
			setActiveItem("");
		};

		const handleTriggerKeyDown = (event: KeyboardEvent) => {
			const { items } = input;

			switch (event.key) {
				case " ":
				case "ArrowDown":
				case "Enter": {
					event.preventDefault();

					open(items.at(0) ?? "");

					break;
				}
				case "ArrowUp": {
					event.preventDefault();

					open(items.at(-1) ?? "");

					break;
				}
				case "Escape": {
					event.preventDefault();

					close();

					break;
				}
			}
		};

		const handleMenuKeyDown = (event: KeyboardEvent) => {
			const { items } = input;

			switch (event.key) {
				case " ":
				case "Enter":
				case "Escape": {
					event.preventDefault();

					close();

					break;
				}
				case "ArrowDown": {
					event.preventDefault();

					setActiveItem(navigateNext(items, activeItem()));

					break;
				}
				case "ArrowUp": {
					event.preventDefault();

					setActiveItem(navigatePrevious(items, activeItem()));

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
			getMenuAttributes: computed(() => ({
				"aria-activedescendant": activeItem()
					? itemId(activeItem())
					: "",
				"id": input.id,
				"onKeyDown": handleMenuKeyDown,
				"role": "menu",
				"tabIndex": -1,
			})),
			getMenuItemAttributes: (item: string) => ({
				id: itemId(item),
				onClick() {
					close();
				},
				role: "menuitem",
				tabIndex: -1,
			}),
			getTriggerAttributes: computed(() => ({
				"aria-controls": input.id,
				"aria-expanded": isOpen(),
				"aria-haspopup": "menu",
				"id": input.triggerId,
				"onClick"() {
					if (isOpen()) {
						close();
					} else {
						open(input.items.at(0) ?? "");
					}
				},
				"onKeyDown": handleTriggerKeyDown,
				"role": "button",
			})),
			isOpen,
		};
	};
