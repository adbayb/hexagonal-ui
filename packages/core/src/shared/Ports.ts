import type { State } from "./types";

export type PatternInputPort<
	RequestModel extends object,
	ResponseModel extends object,
> = (requestModel: RequestModel) => ResponseModel;

export type StateOutputPort = <Value>(
	initialState: Value,
) => readonly [State<Value>, (newValue: Value) => void];

export type LifecycleOutputPort = {
	onMount: (callback: () => void) => void;
	onDestroy: (callback: () => void) => void;
};
