import { useButton, useDisclosure } from "@hexagonal-ui/react";

const Button = () => {
	const { children, props } = useButton({
		children: "Hello from React 👋",
	});

	// eslint-disable-next-line @eslint-react/dom-no-missing-button-type
	return <button {...props}>{children()}</button>;
};

const Disclosure = () => {
	const { isOpen, props } = useDisclosure({
		"aria-controls": "react-panel",
		"id": "react-trigger",
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
				<p id="react-panel">Disclosed content from React 🎉</p>
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
