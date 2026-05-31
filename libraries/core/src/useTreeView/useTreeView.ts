import type { KeyboardEvent } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { Reactive } from "../shared/types";

/**
 * TreeView pattern input.
 */
export type UseTreeViewInput = {
	id: string;
	items: TreeItem[];
};

/**
 * TreeView pattern output.
 */
export type UseTreeViewOutput = {
	expandedItems: Reactive<string[]>;
	getGroupAttributes: (parentId: string) => {
		"aria-labelledby": string;
		"role": "group";
	};
	getTreeAttributes: Reactive<{
		"aria-activedescendant": string;
		"id": string;
		"onKeyDown": (event: KeyboardEvent) => void;
		"role": "tree";
		"tabIndex": 0;
	}>;
	getTreeItemAttributes: (itemId: string) => {
		"aria-expanded": boolean | undefined;
		"aria-selected": boolean;
		"id": string;
		"onClick": () => void;
		"role": "treeitem";
		"tabIndex": -1;
	};
	selectedItem: Reactive<string>;
};

/**
 * Tree View pattern factory.
 * @param input - Helpers.
 * @param input.computed - Computed state factory.
 * @param input.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 * @example
 * 	const useTreeView = createUseTreeView({
 * 		computed: computedAdapter,
 * 		lifecycle: {
 * 			onDestroy: useDestroy,
 * 			onMount: useMount,
 * 		},
 * 		state: useStateAdapter,
 * 	});
 */
export const createUseTreeView: PatternFactory<
	UseTreeViewInput,
	UseTreeViewOutput
> =
	({ computed, state }) =>
	(input) => {
		const [activeItem, setActiveItem] = state(input.items.at(0)?.id ?? "");
		const [selectedItem, setSelectedItem] = state("");
		const [expandedItems, setExpandedItems] = state<string[]>([]);
		const itemId = (id: string) => `${input.id}-${id}`;

		const handleItemClick = (id: string) => {
			setActiveItem(id);
			setSelectedItem(id);

			const item = findItemById(input.items, id);
			const hasChildren = (item?.children?.length ?? 0) > 0;

			if (hasChildren) {
				setExpandedItems(
					expandedItems().includes(id)
						? expandedItems().filter((eid) => eid !== id)
						: [...expandedItems(), id],
				);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			const { items } = input;

			switch (event.key) {
				case " ":
				case "Enter": {
					event.preventDefault();

					setSelectedItem(activeItem());

					break;
				}
				case "ArrowDown": {
					event.preventDefault();

					setActiveItem(
						navigateNext(items, expandedItems(), activeItem()),
					);

					break;
				}
				case "ArrowLeft": {
					event.preventDefault();

					const left = applyArrowLeft(
						items,
						expandedItems(),
						activeItem(),
					);

					setActiveItem(left.activeItem);
					setExpandedItems(left.expandedItems);

					break;
				}
				case "ArrowRight": {
					event.preventDefault();

					const right = applyArrowRight(
						items,
						expandedItems(),
						activeItem(),
					);

					setActiveItem(right.activeItem);
					setExpandedItems(right.expandedItems);

					break;
				}
				case "ArrowUp": {
					event.preventDefault();

					setActiveItem(
						navigatePrevious(items, expandedItems(), activeItem()),
					);

					break;
				}
				case "End": {
					event.preventDefault();

					setActiveItem(
						navigateLast(items, expandedItems(), activeItem()),
					);

					break;
				}
				case "Home": {
					event.preventDefault();

					setActiveItem(
						navigateFirst(items, expandedItems(), activeItem()),
					);

					break;
				}
			}
		};

		return {
			expandedItems,
			getGroupAttributes: (parentId: string) => ({
				"aria-labelledby": itemId(parentId),
				"role": "group",
			}),
			getTreeAttributes: computed(() => ({
				"aria-activedescendant": activeItem()
					? itemId(activeItem())
					: "",
				"id": input.id,
				"onKeyDown": handleKeyDown,
				"role": "tree",
				"tabIndex": 0,
			})),
			getTreeItemAttributes: (id: string) => {
				const item = findItemById(input.items, id);
				const hasChildren = (item?.children?.length ?? 0) > 0;

				return {
					"aria-expanded": hasChildren
						? expandedItems().includes(id)
						: undefined,
					"aria-selected": id === selectedItem(),
					"id": itemId(id),
					"onClick"() {
						handleItemClick(id);
					},
					"role": "treeitem",
					"tabIndex": -1,
				};
			},
			selectedItem,
		};
	};

/**
 * A single node in the tree. Children make a branch; absence makes a leaf.
 */
type TreeItem = {
	children?: TreeItem[];
	id: string;
	label: string;
};

const getVisibleIds = (
	items: TreeItem[],
	expandedItems: string[],
): string[] => {
	const result: string[] = [];

	for (const item of items) {
		result.push(item.id);

		if (item.children !== undefined && expandedItems.includes(item.id)) {
			result.push(...getVisibleIds(item.children, expandedItems));
		}
	}

	return result;
};

const findItemById = (items: TreeItem[], id: string): TreeItem | undefined => {
	for (const item of items) {
		if (item.id === id) return item;

		if (item.children !== undefined) {
			const found = findItemById(item.children, id);

			if (found !== undefined) return found;
		}
	}

	return undefined;
};

const findParentId = (
	items: TreeItem[],
	targetId: string,
	parentId?: string,
): string | undefined => {
	for (const item of items) {
		if (item.id === targetId) return parentId;

		if (item.children !== undefined) {
			const found = findParentId(item.children, targetId, item.id);

			if (found !== undefined) return found;
		}
	}

	return undefined;
};

const navigateNext = (
	allItems: TreeItem[],
	expandedItems: string[],
	current: string,
): string => {
	const visible = getVisibleIds(allItems, expandedItems);
	const index = visible.indexOf(current);

	if (index === -1 || index === visible.length - 1) return current;

	return visible[index + 1] ?? current;
};

const navigatePrevious = (
	allItems: TreeItem[],
	expandedItems: string[],
	current: string,
): string => {
	const visible = getVisibleIds(allItems, expandedItems);
	const index = visible.indexOf(current);

	if (index <= 0) return current;

	return visible[index - 1] ?? current;
};

const navigateFirst = (
	allItems: TreeItem[],
	expandedItems: string[],
	current: string,
): string => getVisibleIds(allItems, expandedItems).at(0) ?? current;

const navigateLast = (
	allItems: TreeItem[],
	expandedItems: string[],
	current: string,
): string => getVisibleIds(allItems, expandedItems).at(-1) ?? current;

const applyArrowRight = (
	allItems: TreeItem[],
	expandedItems: string[],
	activeItem: string,
): { activeItem: string; expandedItems: string[] } => {
	const item = findItemById(allItems, activeItem);

	if (!item?.children?.length) return { activeItem, expandedItems };

	if (!expandedItems.includes(activeItem)) {
		return { activeItem, expandedItems: [...expandedItems, activeItem] };
	}

	return { activeItem: item.children[0]?.id ?? activeItem, expandedItems };
};

const applyArrowLeft = (
	allItems: TreeItem[],
	expandedItems: string[],
	activeItem: string,
): { activeItem: string; expandedItems: string[] } => {
	if (expandedItems.includes(activeItem)) {
		return {
			activeItem,
			expandedItems: expandedItems.filter((id) => id !== activeItem),
		};
	}

	return {
		activeItem: findParentId(allItems, activeItem) ?? activeItem,
		expandedItems,
	};
};
