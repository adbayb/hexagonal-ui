import type { Reactive } from "./types";

export type EffectPort = (effect: () => unknown) => void;

/**
 * Minimal focusable target. Kept DOM-free so the core stays framework-agnostic.
 */
export type FocusableElement = {
	focus: () => void;
};

export type FrameworkPort = {
	computed: <Value>(function_: () => Value) => Reactive<Value>;
	effect: EffectPort;
	lifecycle: {
		onDestroy: (callback: () => void) => void;
		onMount: (callback: () => void) => void;
	};
	ref: RefPort;
	state: <Value>(
		initialState: Value,
	) => readonly [Reactive<Value>, (newValue: Value) => void];
};

export type RefPort = <Value>(
	initialValue?: null | Value,
) => readonly [Reactive<null | Value>, (newValue: null | Value) => void];
