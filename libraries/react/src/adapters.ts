import type { FrameworkPort } from "@hexagonal-ui/core";

import { useEffect, useRef, useState as useStateReact } from "react";

const useMount: FrameworkPort["lifecycle"]["onMount"] = (callback) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current();
	}, []);
};

const useDestroy: FrameworkPort["lifecycle"]["onDestroy"] = (callback) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		return callbackRef.current;
	}, []);
};

const useState: FrameworkPort["state"] = (initialState) => {
	const [value, setValue] = useStateReact(initialState);

	return [
		() => value,
		(newValue) => {
			setValue(newValue);
		},
	] as const;
};

/*
 * In React, the hook re-runs on every render so fn already captures current
 * state values via closure — no memoization needed for correctness.
 */
const computed: FrameworkPort["computed"] = (function_) => function_;

export const frameworkAdapter: FrameworkPort = {
	computed,
	lifecycle: {
		onDestroy: useDestroy,
		onMount: useMount,
	},
	state: useState,
};
