import { useButton as useButtonPattern } from "@hexagonal-ui/core";
import { useEffect, useRef, useState } from "react";

export const useButton = () => {
	const patternRef = useRef(
		useButtonPattern({
			children: "Hello world",
		}),
	);

	const [children, setChildren] = useState(patternRef.current.children.value);

	useEffect(() => {
		patternRef.current.children.observe(setChildren);

		return () => {
			patternRef.current.children.unobserve();
		};
	}, []);

	return {
		children,
	};
};
