import type { UseButtonViewModel } from "@hexagonal-ui/core";
import { useButton as useButtonPattern } from "@hexagonal-ui/core";
import { useEffect, useRef, useState } from "react";

export const useButton: UseButtonViewModel = (initialState) => {
	const patternRef = useRef(useButtonPattern(initialState));
	const [children, setChildren] = useState(patternRef.current.children.value);

	useEffect(() => {
		const observableChildren = patternRef.current.children;

		observableChildren.observe(setChildren);

		return () => {
			observableChildren.unobserve();
		};
	}, []);

	return {
		...patternRef.current,
		children,
	};
};
