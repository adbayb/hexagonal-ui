export type Pattern<
	RequestModel extends object,
	ResponseModel extends object,
> = (requestModel: RequestModel) => ResponseModel;
