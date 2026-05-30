import {
	useButton,
	useCombobox,
	useDisclosure,
	useListbox,
} from "@hexagonal-ui/vue";
import { defineComponent } from "vue";

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
		const listbox = useListbox({
			id: "vue-listbox-widget",
			options: FRUITS,
		});

		const { getListboxAttributes, getOptionAttributes, selectedOption } =
			listbox;

		return () => (
			<div>
				<ul {...getListboxAttributes()}>
					{FRUITS.map((option) => (
						<li
							key={option}
							{...getOptionAttributes(option)}
						>
							{option}
						</li>
					))}
				</ul>
				{selectedOption() && <p>Selected: {selectedOption()}</p>}
			</div>
		);
	},
});

export const App = () => (
	<>
		<Button />
		<Disclosure />
		<Combobox />
		<Listbox />
	</>
);
