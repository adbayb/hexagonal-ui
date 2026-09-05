import type { FocusableElement, UseTreeViewInput } from "@hexagonal-ui/vue";
import type { VNode } from "vue";

import {
	useButton,
	useCombobox,
	useDisclosure,
	useListbox,
	useMenu,
	useMenubar,
	useSelect,
	useTreeView,
} from "@hexagonal-ui/vue";
import { defineComponent } from "vue";

const Section = defineComponent({
	props: {
		title: { required: true, type: String },
	},
	setup(props, { slots }) {
		return () => (
			<section>
				<h2>{props.title}</h2>
				{slots.default?.()}
			</section>
		);
	},
});

const FRUITS = [
	"Apple",
	"Banana",
	"Cherry",
	"Date",
	"Elderberry",
	"Fig",
	"Grape",
];

/*
 * Prevent the input from blurring (and the popup from closing) before the
 * option click registers.
 */
const keepFocusOnMouseDown = (event: { preventDefault: () => void }) => {
	event.preventDefault();
};

const Button = defineComponent({
	setup() {
		// eslint-disable-next-line @eslint-react/rules-of-hooks
		const { getAttributes } = useButton({
			children: "Hello from Vue 👋",
			isDisabled: false,
		});

		return () => {
			/*
			 * Unlike React and Solid, Vue JSX does not treat a spread `children` prop as slot content.
			 * It must be extracted and rendered explicitly between tags.
			 */
			const { children, ...attributes } = getAttributes();

			// eslint-disable-next-line @eslint-react/dom-no-missing-button-type
			return <button {...attributes}>{children}</button>;
		};
	},
});

const Disclosure = defineComponent({
	setup() {
		// eslint-disable-next-line @eslint-react/rules-of-hooks
		const { getTriggerAttributes, isOpen } = useDisclosure({
			id: "vue-panel",
		});

		return () => (
			<div>
				{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
				<button {...getTriggerAttributes()}>
					{isOpen() ? "Hide" : "Show"} content
				</button>
				{isOpen() && (
					<p id="vue-panel">Disclosed content from Vue 🎉</p>
				)}
			</div>
		);
	},
});

const Combobox = defineComponent({
	setup() {
		// eslint-disable-next-line @eslint-react/rules-of-hooks
		const combobox = useCombobox({
			id: "vue-listbox",
			options: FRUITS,
		});

		const {
			filteredOptions,
			getInputAttributes,
			getOptionAttributes,
			isOpen,
			selectedOption,
		} = combobox;

		return () => (
			<div>
				<input {...getInputAttributes()} />
				{isOpen() && (
					<ul
						id="vue-listbox"
						role="listbox"
					>
						{filteredOptions().map((option) => (
							<li
								key={option}
								{...getOptionAttributes(option)()}
								// eslint-disable-next-line @eslint-react/dom-no-unknown-property
								onMousedown={keepFocusOnMouseDown}
							>
								{option}
							</li>
						))}
					</ul>
				)}
				{selectedOption() && <p>Selected: {selectedOption()}</p>}
			</div>
		);
	},
});

const Listbox = defineComponent({
	setup() {
		// eslint-disable-next-line @eslint-react/rules-of-hooks
		const { getListboxAttributes, getOptionAttributes } = useListbox({
			id: "vue-listbox-widget",
			options: FRUITS,
		});

		return () => {
			return (
				<div>
					<ul
						{...getListboxAttributes()}
						style={{ listStyle: "none", padding: "0" }}
					>
						{FRUITS.map((option) => {
							const attributes = getOptionAttributes(option)();

							return (
								<li
									key={option}
									{...attributes}
									style={{
										alignItems: "center",
										background: attributes["aria-selected"]
											? "#e0f2fe"
											: "transparent",
										cursor: "pointer",
										display: "flex",
										fontWeight: attributes["aria-selected"]
											? "bold"
											: "normal",
										gap: "0.5rem",
										padding: "0.25rem 0.5rem",
									}}
								>
									<span
										style={{
											visibility: attributes[
												"aria-selected"
											]
												? "visible"
												: "hidden",
										}}
									>
										✓
									</span>
									{option}
								</li>
							);
						})}
					</ul>
				</div>
			);
		};
	},
});

const ACTIONS = ["Copy", "Cut", "Paste", "Delete"];
const NAV_ITEMS = ["File", "Edit", "View", "Help"];

/*
 * Vue's VNodeRef passes `Element | ComponentPublicInstance`, which is wider
 * than the core's `FocusableElement`, so adapt it at the boundary.
 */
const toFocusableRef =
	(setter: (node: FocusableElement | null) => void) => (node: unknown) => {
		setter(node as FocusableElement | null);
	};

const Menu = defineComponent({
	setup() {
		// eslint-disable-next-line @eslint-react/rules-of-hooks
		const menu = useMenu({
			id: "vue-menu",
			items: ACTIONS,
			triggerId: "vue-menu-trigger",
		});

		const {
			getMenuAttributes,
			getMenuItemAttributes,
			getTriggerAttributes,
			isOpen,
			menuRef,
			triggerRef,
		} = menu;

		return () => {
			return (
				<div style={{ position: "relative" }}>
					{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
					<button
						{...getTriggerAttributes()}
						// eslint-disable-next-line @eslint-react/refs -- not a React ref: plain setter from useMenu, adapted for Vue's VNodeRef
						ref={toFocusableRef(triggerRef)}
					>
						Actions ▾
					</button>
					{isOpen() && (
						<ul
							{...getMenuAttributes()}
							// eslint-disable-next-line @eslint-react/refs -- not a React ref: plain setter from useMenu, adapted for Vue's VNodeRef
							ref={toFocusableRef(menuRef)}
							style={{
								background: "#fff",
								border: "1px solid #ccc",
								listStyle: "none",
								margin: "0",
								padding: "0.25rem 0",
								position: "absolute",
							}}
						>
							{ACTIONS.map((action) => (
								<li
									key={action}
									{...getMenuItemAttributes(action)()}
									style={{
										cursor: "pointer",
										padding: "0.25rem 1rem",
									}}
								>
									{action}
								</li>
							))}
						</ul>
					)}
				</div>
			);
		};
	},
});

const Menubar = defineComponent({
	setup() {
		// eslint-disable-next-line @eslint-react/rules-of-hooks
		const menubar = useMenubar({
			id: "vue-menubar",
			items: NAV_ITEMS,
		});

		const { activeItem, getMenubarAttributes, getMenuItemAttributes } =
			menubar;

		return () => (
			<ul
				{...getMenubarAttributes()}
				style={{
					display: "flex",
					gap: "0.25rem",
					listStyle: "none",
					padding: "0",
				}}
			>
				{NAV_ITEMS.map((item) => {
					const itemAttributes = getMenuItemAttributes(item)();

					return (
						<li key={item}>
							{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
							<button
								{...itemAttributes}
								style={{
									background:
										activeItem() === item
											? "#e0f2fe"
											: "transparent",
									border: "none",
									cursor: "pointer",
									fontWeight:
										activeItem() === item
											? "bold"
											: "normal",
									padding: "0.25rem 0.75rem",
								}}
							>
								{item}
							</button>
						</li>
					);
				})}
			</ul>
		);
	},
});

const Select = defineComponent({
	setup() {
		// eslint-disable-next-line @eslint-react/rules-of-hooks
		const select = useSelect({
			id: "vue-select",
			options: FRUITS,
			triggerId: "vue-select-trigger",
		});

		const {
			getListboxAttributes,
			getOptionAttributes,
			getTriggerAttributes,
			isOpen,
			selectedOption,
		} = select;

		return () => (
			<div style={{ position: "relative" }}>
				{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
				<button {...getTriggerAttributes()}>
					{selectedOption() === ""
						? "Choose a fruit"
						: selectedOption()}{" "}
					▾
				</button>
				{isOpen() && (
					<ul
						{...getListboxAttributes()}
						style={{
							background: "#fff",
							border: "1px solid #ccc",
							listStyle: "none",
							margin: "0",
							padding: "0.25rem 0",
							position: "absolute",
						}}
					>
						{FRUITS.map((option) => (
							<li
								key={option}
								{...getOptionAttributes(option)()}
								style={{
									cursor: "pointer",
									padding: "0.25rem 1rem",
								}}
							>
								{option}
							</li>
						))}
					</ul>
				)}
			</div>
		);
	},
});

const TREE_ITEMS: UseTreeViewInput["items"] = [
	{
		children: [
			{ id: "src-index", label: "index.ts" },
			{
				children: [
					{ id: "src-components-button", label: "Button.tsx" },
					{ id: "src-components-input", label: "Input.tsx" },
				],
				id: "src-components",
				label: "components/",
			},
		],
		id: "src",
		label: "src/",
	},
	{
		children: [
			{ id: "public-favicon", label: "favicon.ico" },
			{ id: "public-robots", label: "robots.txt" },
		],
		id: "public",
		label: "public/",
	},
	{ id: "package-json", label: "package.json" },
];

const getItemPrefix = (hasChildren: boolean, isExpanded: boolean): string => {
	if (!hasChildren) return "  ";

	return isExpanded ? "▾ " : "▸ ";
};

const TreeView = defineComponent({
	setup() {
		// eslint-disable-next-line @eslint-react/rules-of-hooks
		const treeView = useTreeView({ id: "vue-tree", items: TREE_ITEMS });

		const {
			expandedItems,
			getGroupAttributes,
			getTreeAttributes,
			getTreeItemAttributes,
		} = treeView;

		const renderItems = (items: UseTreeViewInput["items"]): VNode[] =>
			items.map((item) => (
				<li key={item.id}>
					<span
						{...getTreeItemAttributes(item.id)()}
						style={{
							cursor: "pointer",
							display: "block",
							padding: "0.125rem 0.25rem",
						}}
					>
						{getItemPrefix(
							(item.children?.length ?? 0) > 0,
							expandedItems().includes(item.id),
						)}
						{item.label}
					</span>
					{item.children && expandedItems().includes(item.id) && (
						<ul
							{...getGroupAttributes(item.id)()}
							style={{ paddingLeft: "1rem" }}
						>
							{renderItems(item.children)}
						</ul>
					)}
				</li>
			));

		return () => {
			return (
				<ul
					{...getTreeAttributes()}
					style={{ listStyle: "none", padding: "0" }}
				>
					{renderItems(TREE_ITEMS)}
				</ul>
			);
		};
	},
});

export const App = () => (
	<>
		<Section title="Button">
			<Button />
		</Section>
		<Section title="Disclosure">
			<Disclosure />
		</Section>
		<Section title="Combobox">
			<Combobox />
		</Section>
		<Section title="Listbox">
			<Listbox />
		</Section>
		<Section title="Menu">
			<Menu />
		</Section>
		<Section title="Menubar">
			<Menubar />
		</Section>
		<Section title="Select">
			<Select />
		</Section>
		<Section title="Tree View">
			<TreeView />
		</Section>
	</>
);
