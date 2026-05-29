import { useButton, useDisclosure } from "@hexagonal-ui/solid";

const Button = () => {
	const { children, props } = useButton({
		children: "Hello from Solid 👋",
	});

	// eslint-disable-next-line @eslint-react/dom-no-missing-button-type
	return <button {...props}>{children()}</button>;
};

const Disclosure = () => {
	const { isOpen, props } = useDisclosure({
		"aria-controls": "solid-panel",
		"id": "solid-trigger",
	});

	return (
		<div>
			{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
			<button
				{...props}
				aria-expanded={isOpen()}
			>
				{isOpen() ? "Hide" : "Show"} content
			</button>
			{isOpen() && (
				<p id="solid-panel">Disclosed content from Solid 🎉</p>
			)}
		</div>
	);
};

export const App = () => {
	return (
		<>
			<Button />
			<Disclosure />
		</>
	);
};
