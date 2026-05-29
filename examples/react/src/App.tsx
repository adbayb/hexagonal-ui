import { useButton } from "@hexagonal-ui/react";

const Button = () => {
	const { children, props } = useButton({
		children: "Hello from React 👋",
	});

	// eslint-disable-next-line @eslint-react/dom-no-missing-button-type
	return <button {...props}>{children()}</button>;
};

export const App = () => {
	return <Button />;
};
