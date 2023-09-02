import { useButton } from "@hexagonal-ui/react";

export const App = () => {
	const { tag: Component, ...props } = useButton({ children: "Hello" });

	console.log(props);

	return <Component {...props} />;
};
