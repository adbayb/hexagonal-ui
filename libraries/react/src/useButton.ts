import { createUseButton } from "@hexagonal-ui/core";
import { useEffect, useRef, useState } from "react";

const useMount = (callback: () => void) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current();
	}, []);
};

const useDestroy = (callback: () => void) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		return callbackRef.current;
	}, []);
};

const useStateAdapter = <Value>(initialState: Value) => {
	const [value, setValue] = useState(initialState);

	return [
		() => value,
		(newValue: Value) => {
			setValue(newValue);
		},
	] as const;
};

const computedAdapter = <Value>(function_: () => Value) => function_;

export const useButton = createUseButton({
	computed: computedAdapter,
	lifecycle: {
		onDestroy: useDestroy,
		onMount: useMount,
	},
	state: useStateAdapter,
});
