import type { Ports } from "@hexagonal-ui/core";

import { useEffect, useRef, useState } from "react";

export const useMount = (callback: () => void) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current();
	}, []);
};

export const useDestroy = (callback: () => void) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		return callbackRef.current;
	}, []);
};

export const useStateAdapter = <Value>(initialState: Value) => {
	const [value, setValue] = useState(initialState);

	return [
		() => value,
		(newValue: Value) => {
			setValue(newValue);
		},
	] as const;
};

/*
 * In React, the hook re-runs on every render so fn already captures current
 * state values via closure — no memoization needed for correctness.
 */
export const computedAdapter = <Value>(function_: () => Value) => function_;

export const ports: Ports = {
	computed: computedAdapter,
	lifecycle: {
		onDestroy: useDestroy,
		onMount: useMount,
	},
	state: useStateAdapter,
};
