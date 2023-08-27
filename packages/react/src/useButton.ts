import { useButton as useButtonPattern } from "@hexagonal-ui/core";

export const useButton = () => {
	// @todo: useMemo, useState, ...
	return useButtonPattern(
		{},
		{
			update() {
				console.log("todo state management");
			},
		},
	);
};
