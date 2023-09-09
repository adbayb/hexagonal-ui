export type PatternPort<
	RequestModel extends object,
	ResponseModel extends object,
> = (requestModel: RequestModel) => ResponseModel;

export type StatePort = <Value>(
	initialState: Value,
) => [Value, (newValue: Value) => void];

export type LifecyclePort = {
	onMount: () => void;
	onDestroy: () => void;
};
