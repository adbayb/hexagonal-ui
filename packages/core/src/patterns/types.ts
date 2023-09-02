import type { Observable } from "./observer";

export type Pattern<
	RequestModel extends object,
	ResponseModel extends object,
> = (requestModel: RequestModel) => ResponseModel;

/**
 * Utility type to generate an exploitable model UI side by unwrapping any observable value from the `Pattern` output
 */
export type ViewModel<
	RequestModel extends object,
	ResponseModel extends object,
> = (initialState: RequestModel) => {
	[K in keyof ResponseModel]: ResponseModel[K] extends Observable<infer V>
		? V
		: ResponseModel[K];
};
