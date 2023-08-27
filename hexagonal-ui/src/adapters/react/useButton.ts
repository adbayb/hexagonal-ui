import { Button } from "../../core/elements/Button";

export const useButton = () => {
	// @todo: useMemo
	const props = new Button({
		children: "Hello world",
	}).toObject();

	// @todo: useState, ...
	return +props;
};
