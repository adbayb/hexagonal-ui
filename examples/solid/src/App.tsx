import { useButton } from "@hexagonal-ui/solid";
import { Dynamic } from "solid-js/web";

const Button = () => {
	const { tag, ...props } = useButton({ children: "Hello from Solid 👋" });

	return (
		<Dynamic
			component={tag}
			{...props}
		/>
	);
};

export const App = () => {
	return <Button />;
};
