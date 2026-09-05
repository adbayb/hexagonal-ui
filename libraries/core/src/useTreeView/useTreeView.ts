import type { KeyboardEvent } from "../shared/Event";
import type { PatternFactory } from "../shared/Pattern";
import type { FrameworkPort } from "../shared/Port";
import type { Reactive } from "../shared/types";

/**
 * A single node in the tree. Children make a branch; absence makes a leaf.
 */
export type TreeItem = {
	children?: TreeItem[];
	id: string;
	label: string;
};

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
	getGroupAttributes: (parentId: string) => Reactive<{
		"aria-labelledby": string;
		"role": "group";
	}>;
	getTreeAttributes: Reactive<{
		"aria-activedescendant": string;
		"id": string;
		"onKeyDown": (event: KeyboardEvent) => void;
		"role": "tree";
		"tabIndex": 0;
	}>;
	getTreeItemAttributes: (itemId: string) => Reactive<{
		"aria-expanded": boolean | undefined;
		"aria-level": number;
		"aria-posinset": number;
		"aria-selected": boolean;
		"aria-setsize": number;
		"id": string;
		"onClick": () => void;
		"role": "treeitem";
		"tabIndex": -1;
	}>;
	selectedItem: Reactive<string>;
};

/**
 * Tree View pattern factory.
 * Focus stays on the tree container and the active node is exposed via
 * `aria-activedescendant`, so treeitems keep `tabIndex: -1`.
 * @param frameworkAdapter - Helpers.
 * @param frameworkAdapter.computed - Computed state factory.
 * @param frameworkAdapter.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 * @example
 * 	const useTreeView = createUseTreeView({ computed, state });
 */
export const createUseTreeView: PatternFactory<
	UseTreeViewInput,
	UseTreeViewOutput,
	Pick<FrameworkPort, "computed" | "state">
> = ({ computed, state }) => {
	return (input) => {
		const [activeItem, setActiveItem] = state(input.items.at(0)?.id ?? "");
		const [selectedItem, setSelectedItem] = state("");
		const [expandedItems, setExpandedItems] = state<string[]>([]);
		const [typeahead, setTypeahead] = state({ query: "", timestamp: 0 });
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
			const context: KeyHandlerContext = {
				activeItem: activeItem(),
				expandedItems: expandedItems(),
				items: input.items,
				setActiveItem,
				setExpandedItems,
				setTypeahead,
				typeahead: typeahead(),
			};

			if (handleExpansionOrTypeaheadKey(event, context)) {
				return;
			}

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

					setActiveItem(navigateLast(items, expandedItems()));

					break;
				}
				case "Home": {
					event.preventDefault();

					setActiveItem(navigateFirst(items, expandedItems()));

					break;
				}
			}
		};

		return {
			expandedItems,
			getGroupAttributes: (parentId: string) =>
				computed(() => ({
					"aria-labelledby": itemId(parentId),
					"role": "group",
				})),
			getTreeAttributes: computed(() => ({
				"aria-activedescendant": activeItem()
					? itemId(activeItem())
					: "",
				"id": input.id,
				"onKeyDown": handleKeyDown,
				"role": "tree",
				"tabIndex": 0,
			})),
			getTreeItemAttributes: (id: string) =>
				computed(() => {
					const meta = findItemMeta(input.items, id);

					return {
						"aria-expanded":
							(meta?.hasChildren ?? false)
								? expandedItems().includes(id)
								: undefined,
						"aria-level": meta?.level ?? 1,
						"aria-posinset": meta?.posinset ?? 1,
						"aria-selected": id === selectedItem(),
						"aria-setsize": meta?.setsize ?? 1,
						"id": itemId(id),
						// eslint-disable-next-line sonarjs/no-nested-functions -- per-item computed needs the id closure for fine-grained reactivity
						"onClick"() {
							handleItemClick(id);
						},
						"role": "treeitem",
						"tabIndex": -1,
					};
				}),
			selectedItem,
		};
	};
};

const TYPEAHEAD_TIMEOUT = 500;

type KeyHandlerContext = {
	activeItem: string;
	expandedItems: string[];
	items: TreeItem[];
	setActiveItem: (id: string) => void;
	setExpandedItems: (ids: string[]) => void;
	setTypeahead: (state: TypeaheadState) => void;
	typeahead: TypeaheadState;
};

type TypeaheadState = {
	query: string;
	timestamp: number;
};

const handleExpansionOrTypeaheadKey = (
	event: KeyboardEvent,
	context: KeyHandlerContext,
): boolean =>
	handleStarKey(event, context) || handleTypeaheadKey(event, context);

const handleStarKey = (
	event: KeyboardEvent,
	context: KeyHandlerContext,
): boolean => {
	if (event.key !== "*") return false;

	event.preventDefault();

	context.setExpandedItems(
		expandSiblings(
			context.items,
			context.expandedItems,
			context.activeItem,
		),
	);

	return true;
};

const handleTypeaheadKey = (
	event: KeyboardEvent,
	context: KeyHandlerContext,
): boolean => {
	if (event.key.length !== 1 || event.ctrlKey || event.metaKey) return false;

	event.preventDefault();

	const now = Date.now();

	const query =
		now - context.typeahead.timestamp < TYPEAHEAD_TIMEOUT
			? `${context.typeahead.query}${event.key}`
			: event.key;

	context.setTypeahead({ query, timestamp: now });

	const match = matchTypeahead(
		context.items,
		getVisibleIds(context.items, context.expandedItems),
		context.activeItem,
		query,
	);

	if (match !== undefined) context.setActiveItem(match);

	return true;
};

type ItemMeta = {
	hasChildren: boolean;
	level: number;
	posinset: number;
	setsize: number;
};

const findItemMeta = (
	items: TreeItem[],
	id: string,
	level = 1,
): ItemMeta | undefined => {
	for (const [index, item] of items.entries()) {
		if (item.id === id) {
			return {
				hasChildren: (item.children?.length ?? 0) > 0,
				level,
				posinset: index + 1,
				setsize: items.length,
			};
		}

		if (item.children !== undefined) {
			const found = findItemMeta(item.children, id, level + 1);

			if (found !== undefined) return found;
		}
	}

	return undefined;
};

const findSiblings = (
	items: TreeItem[],
	targetId: string,
): TreeItem[] | undefined => {
	for (const item of items) {
		if (item.children?.some((child) => child.id === targetId)) {
			return item.children;
		}

		if (item.children !== undefined) {
			const found = findSiblings(item.children, targetId);

			if (found !== undefined) return found;
		}
	}

	return undefined;
};

const expandSiblings = (
	items: TreeItem[],
	expandedItems: string[],
	activeId: string,
): string[] => {
	const siblings = findSiblings(items, activeId) ?? items;

	const missing = siblings
		.filter(
			(sibling) =>
				(sibling.children?.length ?? 0) > 0 &&
				!expandedItems.includes(sibling.id),
		)
		.map((sibling) => sibling.id);

	return [...expandedItems, ...missing];
};

const matchTypeahead = (
	items: TreeItem[],
	visibleIds: string[],
	activeId: string,
	query: string,
): string | undefined => {
	const lowerQuery = query.toLowerCase();
	const start = visibleIds.indexOf(activeId);

	const ordered = [
		...visibleIds.slice(start + 1),
		...visibleIds.slice(0, start + 1),
	];

	return ordered.find((id) =>
		findItemById(items, id)?.label.toLowerCase().startsWith(lowerQuery),
	);
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

const navigateFirst = (allItems: TreeItem[], expandedItems: string[]): string =>
	getVisibleIds(allItems, expandedItems).at(0) ?? "";

const navigateLast = (allItems: TreeItem[], expandedItems: string[]): string =>
	getVisibleIds(allItems, expandedItems).at(-1) ?? "";

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
