import type { KeyboardEvent } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { FocusableElement, FrameworkPort } from "../shared/Port";
import type { Reactive } from "../shared/types";

import { navigateNext, navigatePrevious } from "../shared/navigation";

/**
 * Menu pattern input. `id` is the menu id; the trigger id defaults to
 * `${id}-trigger` when omitted.
 */
export type UseMenuInput = {
	id: string;
	items: string[];
	triggerId?: string;
};

/**
 * Menu pattern output.
 */
export type UseMenuOutput = {
	activeItem: Reactive<string>;
	getMenuAttributes: Reactive<{
		"aria-activedescendant": string;
		"id": string;
		"onKeyDown": (event: KeyboardEvent) => void;
		"role": "menu";
		"tabIndex": -1;
	}>;
	getMenuItemAttributes: (item: string) => Reactive<{
		id: string;
		onClick: () => void;
		role: "menuitem";
		tabIndex: -1;
	}>;
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
	menuRef: (node: FocusableElement | null) => void;
	triggerRef: (node: FocusableElement | null) => void;
};

/**
 * Menu pattern factory.
 * @param frameworkAdapter - Helpers.
 * @param frameworkAdapter.computed - Computed state factory.
 * @param frameworkAdapter.effect - Reactive side-effect runner.
 * @param frameworkAdapter.ref - Element reference factory.
 * @param frameworkAdapter.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menu/
 * @example
 * 	const useMenu = createUseMenu({ computed, effect, ref, state });
 */
export const createUseMenu: PatternFactory<
	UseMenuInput,
	UseMenuOutput,
	Pick<FrameworkPort, "computed" | "effect" | "ref" | "state">
> = ({ computed, effect, ref, state }) => {
	return (input) => {
		const [isOpen, setIsOpen] = state(false);
		const [activeItem, setActiveItem] = state("");
		const [menuNode, setMenuNode] = ref<FocusableElement>(null);
		const [triggerNode, setTriggerNode] = ref<FocusableElement>(null);
		const [wasOpen, setWasOpen] = state(false);
		const itemId = (item: string) => `${input.id}-${item}`;
		const triggerId = input.triggerId ?? `${input.id}-trigger`;

		const open = (item: string) => {
			setIsOpen(true);
			setActiveItem(item);
		};

		const close = () => {
			setIsOpen(false);
			setActiveItem("");
		};

		// Move focus into the menu on open, back to the trigger on close.
		effect(() => {
			const openNow = isOpen();

			if (openNow === wasOpen()) return;

			setWasOpen(openNow);

			if (openNow) {
				menuNode()?.focus();
			} else {
				triggerNode()?.focus();
			}
		});

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
			getMenuItemAttributes: (item: string) =>
				computed(() => ({
					id: itemId(item),
					// eslint-disable-next-line sonarjs/no-nested-functions -- per-item computed needs the item closure for fine-grained reactivity
					onClick() {
						close();
					},
					role: "menuitem",
					tabIndex: -1,
				})),
			getTriggerAttributes: computed(() => ({
				"aria-controls": input.id,
				"aria-expanded": isOpen(),
				"aria-haspopup": "menu",
				"id": triggerId,
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
			menuRef: setMenuNode,
			triggerRef: setTriggerNode,
		};
	};
};
