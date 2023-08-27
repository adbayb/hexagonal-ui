import { useButton } from "@hexagonal-ui/react";

export const App = () => {
	const props = useButton();

	console.log(props);

	return <div>Hello world</div>;
};
