import { useButton } from "@hexagonal-ui/react";

const Button = () => {
	const { props, children } = useButton({
		children: "Hello from React 👋",
	});

	return <button {...props}>{children()}</button>;
};

export const App = () => {
	return <Button />;
};
