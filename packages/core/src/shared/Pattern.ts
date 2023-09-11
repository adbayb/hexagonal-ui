import type {
	LifecycleOutputPort,
	PatternInputPort,
	StateOutputPort,
} from "./Ports";
import type { AnyObject, State } from "./types";

export type PatternFactory<
	RequestModel extends PatternInputDto,
	ResponseModel extends PatternOutputDto,
> = (outputPorts: {
	state: StateOutputPort;
	lifecycle: LifecycleOutputPort;
}) => PatternInputPort<RequestModel, ResponseModel>;

/**
 * DTO (Data Transfer Object) interface to uniformize and ease the pattern input definition
 */
export type PatternInputDto<Element = AnyObject> = {
	[Key in keyof Element]: Element[Key] extends State<infer Value>
		? Value
		: Element[Key];
};

/**
 * DTO (Data Transfer Object) interface to uniformize and ease the pattern output consumption.
 * Stateless properties are namespaced with `props` key to ease their spreading consumer side,
 * while stateful properties are inlined to ease their granular access (states are more likely to be used atomically)
 */
export type PatternOutputDto<Element = AnyObject> = {
	[Key in FilterStatefullKeys<Element>]: Element[Key];
} & {
	props: {
		[Key in FilterStatelessKeys<Element>]: Element[Key];
	};
};

type FilterStatelessKeys<Element> = {
	[Key in keyof Element]: Element[Key] extends State ? never : Key;
}[keyof Element];

type FilterStatefullKeys<Element> = {
	[Key in keyof Element]: Element[Key] extends State ? Key : never;
}[keyof Element];
