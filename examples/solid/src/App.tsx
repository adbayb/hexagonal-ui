import { useButton, useCombobox, useDisclosure } from "@hexagonal-ui/solid";

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
		selectedValue,
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
			{selectedValue() && <p>Selected: {selectedValue()}</p>}
		</div>
	);
};

export const App = () => {
	return (
		<>
			<Button />
			<Disclosure />
			<Combobox />
		</>
	);
};
