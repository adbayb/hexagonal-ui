import type { FrameworkPort } from "@hexagonal-ui/core";

import { useEffect, useRef, useState as useStateReact } from "react";

const useMount: FrameworkPort["lifecycle"]["onMount"] = (callback) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	});

	useEffect(() => {
		callbackRef.current();
	}, []);
};

const useDestroy: FrameworkPort["lifecycle"]["onDestroy"] = (callback) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	});

	useEffect(() => {
		return () => {
			callbackRef.current();
		};
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

const useElementReference: FrameworkPort["ref"] = (initialValue = null) => {
	const [value, setValue] = useStateReact(initialValue);

	return [
		() => value,
		(newValue) => {
			setValue(newValue);
		},
	] as const;
};

const usePortEffect: FrameworkPort["effect"] = (effect) => {
	const effectRef = useRef(effect);

	useEffect(() => {
		effectRef.current = effect;
	});

	/*
	 * No dependency array: runs after every render so closures stay fresh.
	 * Core patterns guard with prev-value checks to avoid redundant work.
	 */
	useEffect(() => {
		const cleanup: unknown = effectRef.current();

		if (typeof cleanup === "function") {
			return cleanup as () => void;
		}

		return undefined;
	});
};

/*
 * In React, the hook re-runs on every render so fn already captures current
 * state values via closure — no memoization needed for correctness.
 */
const computed: FrameworkPort["computed"] = (function_) => function_;

export const frameworkAdapter: FrameworkPort = {
	computed,
	effect: usePortEffect,
	lifecycle: {
		onDestroy: useDestroy,
		onMount: useMount,
	},
	ref: useElementReference,
	state: useState,
};
