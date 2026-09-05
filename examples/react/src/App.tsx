import type { UseTreeViewInput } from "@hexagonal-ui/react";

import {
	useButton,
	useCombobox,
	useDisclosure,
	useListbox,
	useMenu,
	useMenubar,
	useSelect,
	useTreeView,
} from "@hexagonal-ui/react";

type SectionProps = { children: React.ReactNode; title: string };

const Section = ({ children, title }: SectionProps) => (
	<section>
		<h2>{title}</h2>
		{children}
	</section>
);

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

const Button = () => {
	const { getAttributes } = useButton({
		children: "Hello from React 👋",
		isDisabled: false,
	});

	// eslint-disable-next-line @eslint-react/dom-no-missing-button-type
	return <button {...getAttributes()} />;
};

const Disclosure = () => {
	const { getTriggerAttributes, isOpen } = useDisclosure({
		id: "react-panel",
	});

	return (
		<div>
			{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
			<button {...getTriggerAttributes()}>
				{isOpen() ? "Hide" : "Show"} content
			</button>
			{isOpen() && (
				<p id="react-panel">Disclosed content from React 🎉</p>
			)}
		</div>
	);
};

const Combobox = () => {
	const {
		filteredOptions,
		getInputAttributes,
		getOptionAttributes,
		isOpen,
		selectedOption,
	} = useCombobox({
		id: "react-listbox",
		options: FRUITS,
	});

	return (
		<div>
			<input {...getInputAttributes()} />
			{isOpen() && (
				<ul
					id="react-listbox"
					role="listbox"
				>
					{filteredOptions().map((option) => (
						<li
							key={option}
							{...getOptionAttributes(option)()}
							onMouseDown={keepFocusOnMouseDown}
						>
							{option}
						</li>
					))}
				</ul>
			)}
			{selectedOption() && <p>Selected: {selectedOption()}</p>}
		</div>
	);
};

const Listbox = () => {
	const { getListboxAttributes, getOptionAttributes } = useListbox({
		id: "react-listbox-widget",
		options: FRUITS,
	});

	return (
		<div>
			<ul
				{...getListboxAttributes()}
				style={{ listStyle: "none", padding: 0 }}
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
									visibility: attributes["aria-selected"]
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

const ACTIONS = ["Copy", "Cut", "Paste", "Delete"];
const NAV_ITEMS = ["File", "Edit", "View", "Help"];

const Menu = () => {
	const {
		getMenuAttributes,
		getMenuItemAttributes,
		getTriggerAttributes,
		isOpen,
		menuRef,
		triggerRef,
	} = useMenu({
		id: "react-menu",
		items: ACTIONS,
		triggerId: "react-menu-trigger",
	});

	return (
		<div style={{ position: "relative" }}>
			{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
			<button
				{...getTriggerAttributes()}
				ref={triggerRef}
			>
				Actions ▾
			</button>
			{isOpen() && (
				<ul
					{...getMenuAttributes()}
					ref={menuRef}
					style={{
						background: "#fff",
						border: "1px solid #ccc",
						listStyle: "none",
						margin: 0,
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

const Menubar = () => {
	const { activeItem, getMenubarAttributes, getMenuItemAttributes } =
		useMenubar({
			id: "react-menubar",
			items: NAV_ITEMS,
		});

	return (
		<ul
			{...getMenubarAttributes()}
			style={{
				display: "flex",
				gap: "0.25rem",
				listStyle: "none",
				padding: 0,
			}}
		>
			{NAV_ITEMS.map((item) => (
				<li key={item}>
					{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
					<button
						{...getMenuItemAttributes(item)()}
						style={{
							background:
								activeItem() === item
									? "#e0f2fe"
									: "transparent",
							border: "none",
							cursor: "pointer",
							fontWeight:
								activeItem() === item ? "bold" : "normal",
							padding: "0.25rem 0.75rem",
						}}
					>
						{item}
					</button>
				</li>
			))}
		</ul>
	);
};

const Select = () => {
	const {
		getListboxAttributes,
		getOptionAttributes,
		getTriggerAttributes,
		isOpen,
		selectedOption,
	} = useSelect({
		id: "react-select",
		options: FRUITS,
		triggerId: "react-select-trigger",
	});

	return (
		<div style={{ position: "relative" }}>
			{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
			<button {...getTriggerAttributes()}>
				{selectedOption() === "" ? "Choose a fruit" : selectedOption()}{" "}
				▾
			</button>
			{isOpen() && (
				<ul
					{...getListboxAttributes()}
					style={{
						background: "#fff",
						border: "1px solid #ccc",
						listStyle: "none",
						margin: 0,
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
};

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

const TreeView = () => {
	const {
		expandedItems,
		getGroupAttributes,
		getTreeAttributes,
		getTreeItemAttributes,
	} = useTreeView({ id: "react-tree", items: TREE_ITEMS });

	const renderItems = (items: UseTreeViewInput["items"]): React.ReactNode =>
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

	return (
		<ul
			{...getTreeAttributes()}
			style={{ listStyle: "none", padding: 0 }}
		>
			{renderItems(TREE_ITEMS)}
		</ul>
	);
};

export const App = () => {
	return (
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
};
