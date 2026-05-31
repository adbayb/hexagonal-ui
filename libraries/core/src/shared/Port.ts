import type { Reactive } from "./types";

export type FrameworkPort = {
	computed: <Value>(function_: () => Value) => Reactive<Value>;
	lifecycle: {
		onDestroy: (callback: () => void) => void;
		onMount: (callback: () => void) => void;
	};
	state: <Value>(
		initialState: Value,
	) => readonly [Reactive<Value>, (newValue: Value) => void];
};
