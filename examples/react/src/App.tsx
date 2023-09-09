import { useButton } from "@hexagonal-ui/react";

const Button = () => {
	const { tag: Component, ...props } = useButton({
		children: "Hello from React 👋",
	});

	return <Component {...props} />;
};

export const App = () => {
	return <Button />;
};
