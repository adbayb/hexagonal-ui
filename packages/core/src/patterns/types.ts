export type Port<
	RequestModel extends Record<string, unknown>,
	ResponseModel extends Record<string, unknown>,
> = (requestModel: RequestModel) => ResponseModel;
