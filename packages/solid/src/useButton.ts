import type { UseButtonViewModel } from "@hexagonal-ui/core";
import { useButton as useButtonPattern } from "@hexagonal-ui/core";
import { createEffect, createSignal } from "solid-js";

export const useButton: UseButtonViewModel = (initialState) => {
	const pattern = useButtonPattern(initialState);
	const [children, setChildren] = createSignal(pattern.children.value);

	createEffect(() => {
		const observableChildren = pattern.children;

		observableChildren.observe(setChildren);

		return () => {
			observableChildren.unobserve();
		};
	});

	return {
		...pattern,
		children: children as unknown as boolean | number | string, // @todo: generify UseButtonViewModel to accept Accessor wrapping
	};
};
