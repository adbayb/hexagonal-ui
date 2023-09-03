import { useButton } from "@hexagonal-ui/react";

export const App = () => {
	const { tag: Component, ...props } = useButton({ children: "Hello" });

	console.log(Component, props);

	return <Component {...props} />;
};
