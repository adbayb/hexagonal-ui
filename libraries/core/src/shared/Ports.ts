import type { State } from "./types";

export type LifecycleOutputPort = {
	onDestroy: (callback: () => void) => void;
	onMount: (callback: () => void) => void;
};

export type PatternInputPort<
	RequestModel extends object,
	ResponseModel extends object,
> = (requestModel: RequestModel) => ResponseModel;

export type StateOutputPort = <Value>(
	initialState: Value,
) => readonly [State<Value>, (newValue: Value) => void];
