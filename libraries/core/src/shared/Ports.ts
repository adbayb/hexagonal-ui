import type { Reactive } from "./types";

export type ComputedPort = <Value>(function_: () => Value) => Reactive<Value>;

export type LifecyclePort = {
	onDestroy: (callback: () => void) => void;
	onMount: (callback: () => void) => void;
};

export type StatePort = <Value>(
	initialState: Value,
) => readonly [Reactive<Value>, (newValue: Value) => void];
