import { useButton } from "@hexagonal-ui/solid";
import { Dynamic } from "solid-js/web";

export const App = () => {
	const { tag, ...props } = useButton({ children: "Hello" });

	console.log(tag, props);

	return (
		<Dynamic
			component={tag}
			{...props}
		/>
	);
};
