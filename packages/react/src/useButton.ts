import { UseButton } from "@hexagonal-ui/core";

export const useButton = () => {
	// @todo: useMemo
	// @todo: useState, ...
	return new UseButton().toObject();
};
