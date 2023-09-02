import { useButton } from "@hexagonal-ui/react";

export const App = () => {
	const props = useButton();

	return <div {...props} />;
};
