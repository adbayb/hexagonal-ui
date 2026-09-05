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
		() => {
			return value;
		},
		(newValue) => {
			setValue(newValue);
		},
	] as const;
};

const useElementReference = <Value>(
	initialValue: null | Value = null,
): readonly [() => null | Value, (newValue: null | Value) => void] => {
	const [value, setValue] = useStateReact<null | Value>(initialValue);

	return [
		() => {
			return value;
		},
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
const computed: FrameworkPort["computed"] = (function_) => {
	return function_;
};

export const frameworkAdapter: FrameworkPort = {
	ref: useElementReference,
	computed,
	effect: usePortEffect,
	lifecycle: {
		onDestroy: useDestroy,
		onMount: useMount,
	},
	state: useState,
};
