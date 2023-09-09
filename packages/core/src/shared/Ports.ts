// #region Input ports
export type PatternPort<
	RequestModel extends object,
	ResponseModel extends object,
> = (requestModel: RequestModel) => ResponseModel;
// #endregion

// #region Output ports
export type StatePort = <Value>(
	initialState: Value,
) => [Value, (newValue: Value) => void];

export type LifecyclePort = {
	onMount: (callback: () => void) => void;
	onDestroy: (callback: () => void) => void;
};
// #endregion

// #region Others
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PatternFactory<
	RequestModel extends object,
	ResponseModel extends object,
> = (outputPorts: {
	state: StatePort;
	lifecycle: LifecyclePort;
}) => PatternPort<RequestModel, ResponseModel>;
// #endregion
