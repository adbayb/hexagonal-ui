import {
	useButton,
	useCombobox,
	useDisclosure,
	useListbox,
} from "@hexagonal-ui/react";

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
		children: "Hello from React 👋",
		isDisabled: false,
	});

	// eslint-disable-next-line @eslint-react/dom-no-missing-button-type
	return <button {...getAttributes()} />;
};

const Disclosure = () => {
	const { getTriggerAttributes, isOpen } = useDisclosure({
		"aria-controls": "react-panel",
		"id": "react-trigger",
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
		"aria-controls": "react-listbox",
		"options": FRUITS,
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
};

const Listbox = () => {
	const { getListboxAttributes, getOptionAttributes, selectedOption } =
		useListbox({
			id: "react-listbox-widget",
			options: FRUITS,
		});

	return (
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
};

export const App = () => {
	return (
		<>
			<Button />
			<Disclosure />
			<Combobox />
			<Listbox />
		</>
	);
};
