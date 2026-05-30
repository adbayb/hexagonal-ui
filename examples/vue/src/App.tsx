import {
	useButton,
	useCombobox,
	useDisclosure,
	useListbox,
	useMenu,
	useMenubar,
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
			"aria-controls": "vue-panel",
			"id": "vue-trigger",
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
			"aria-controls": "vue-listbox",
			"options": FRUITS,
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
								{...getOptionAttributes(option)}
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
			/*
			 * Vue JSX's parseName uses hyphenate() to derive the DOM event name from the prop:
			 * `onKeyDown` → hyphenate("KeyDown") → "key-down" (never fires).
			 * `onKeydown` → hyphenate("keydown") → "keydown" (correct).
			 * React and Solid map `onKeyDown` directly to the `keydown` event without hyphenation.
			 * So we destructure `onKeyDown` and re-bind it as `onKeydown`.
			 */
			const { onKeyDown, ...listboxAttributes } = getListboxAttributes();

			return (
				<div>
					<ul
						{...listboxAttributes}
						// eslint-disable-next-line @eslint-react/dom-no-unknown-property
						onKeydown={onKeyDown}
						style={{ listStyle: "none", padding: "0" }}
					>
						{FRUITS.map((option) => {
							const attributes = getOptionAttributes(option);

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
		} = menu;

		return () => {
			const { onKeyDown: onMenuKeyDown, ...menuAttributes } =
				getMenuAttributes();

			return (
				<div style={{ position: "relative" }}>
					{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
					<button {...getTriggerAttributes()}>Actions ▾</button>
					{isOpen() && (
						<ul
							{...menuAttributes}
							// eslint-disable-next-line @eslint-react/dom-no-unknown-property
							onKeydown={onMenuKeyDown}
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
					const { onKeyDown: onItemKeyDown, ...itemAttributes } =
						getMenuItemAttributes(item);

					return (
						<li key={item}>
							{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
							<button
								{...itemAttributes}
								// eslint-disable-next-line @eslint-react/dom-no-unknown-property
								onKeydown={onItemKeyDown}
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
	</>
);
