import {
	useButton,
	useCombobox,
	useDisclosure,
	useListbox,
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
		</>
	);
};
