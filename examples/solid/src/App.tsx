import { useButton } from "@hexagonal-ui/solid";

const Button = () => {
	const { props, children } = useButton({
		children: "Hello from Solid 👋",
	});

	return <button {...props}>{children()}</button>;
};

export const App = () => {
	return <Button />;
};
