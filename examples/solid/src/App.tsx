import type { JSX } from "solid-js";

import {
	useButton,
	useCombobox,
	useDisclosure,
	useListbox,
	useMenu,
	useMenubar,
} from "@hexagonal-ui/solid";

type SectionProps = { children: JSX.Element; title: string };

const Section = (props: SectionProps) => (
	<section>
		<h2>{props.title}</h2>
		{props.children}
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

const Button = () => {
	const { getAttributes } = useButton({
		children: "Hello from Solid 👋",
		isDisabled: false,
	});

	// eslint-disable-next-line @eslint-react/dom-no-missing-button-type
	return <button {...getAttributes()} />;
};

const Disclosure = () => {
	const { getTriggerAttributes, isOpen } = useDisclosure({
		"aria-controls": "solid-panel",
		"id": "solid-trigger",
	});

	return (
		<div>
			{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
			<button {...getTriggerAttributes()}>
				{isOpen() ? "Hide" : "Show"} content
			</button>
			{isOpen() && (
				<p id="solid-panel">Disclosed content from Solid 🎉</p>
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
		"aria-controls": "solid-listbox",
		"options": FRUITS,
	});

	return (
		<div>
			<input {...getInputAttributes()} />
			{isOpen() && (
				<ul
					id="solid-listbox"
					role="listbox"
				>
					{filteredOptions().map((option) => (
						// eslint-disable-next-line @eslint-react/no-missing-key
						<li {...getOptionAttributes(option)}>{option}</li>
					))}
				</ul>
			)}
			{selectedOption() && <p>Selected: {selectedOption()}</p>}
		</div>
	);
};

const Listbox = () => {
	const { getListboxAttributes, getOptionAttributes } = useListbox({
		id: "solid-listbox-widget",
		options: FRUITS,
	});

	return (
		<div>
			<ul
				{...getListboxAttributes()}
				style={{ "list-style": "none", "padding": "0" }}
			>
				{FRUITS.map((option) => {
					const attributes = getOptionAttributes(option);

					return (
						// eslint-disable-next-line @eslint-react/no-missing-key
						<li
							{...attributes}
							style={{
								"align-items": "center",
								"background": attributes["aria-selected"]
									? "#e0f2fe"
									: "transparent",
								"cursor": "pointer",
								"display": "flex",
								"font-weight": attributes["aria-selected"]
									? "bold"
									: "normal",
								"gap": "0.5rem",
								"padding": "0.25rem 0.5rem",
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
	} = useMenu({
		id: "solid-menu",
		items: ACTIONS,
		triggerId: "solid-menu-trigger",
	});

	return (
		<div style={{ position: "relative" }}>
			{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
			<button {...getTriggerAttributes()}>Actions ▾</button>
			{isOpen() && (
				<ul
					{...getMenuAttributes()}
					style={{
						"background": "#fff",
						"border": "1px solid #ccc",
						"list-style": "none",
						"margin": "0",
						"padding": "0.25rem 0",
						"position": "absolute",
					}}
				>
					{ACTIONS.map((action) => (
						// eslint-disable-next-line @eslint-react/no-missing-key
						<li
							{...getMenuItemAttributes(action)}
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
			id: "solid-menubar",
			items: NAV_ITEMS,
		});

	return (
		<ul
			{...getMenubarAttributes()}
			style={{
				"display": "flex",
				"gap": "0.25rem",
				"list-style": "none",
				"padding": "0",
			}}
		>
			{NAV_ITEMS.map((item) => (
				// eslint-disable-next-line @eslint-react/no-missing-key
				<li>
					{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
					<button
						{...getMenuItemAttributes(item)}
						style={{
							"background":
								activeItem() === item
									? "#e0f2fe"
									: "transparent",
							"border": "none",
							"cursor": "pointer",
							"font-weight":
								activeItem() === item ? "bold" : "normal",
							"padding": "0.25rem 0.75rem",
						}}
					>
						{item}
					</button>
				</li>
			))}
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
		</>
	);
};
